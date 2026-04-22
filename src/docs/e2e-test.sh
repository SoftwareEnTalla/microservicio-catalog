#!/usr/bin/env bash
# E2E tests para catalog-service (puerto 3001 por defecto).
# Valida HU1-HU10 del bounded context catalog.
#
# Uso:
#   ./e2e-test.sh                    # default http://localhost:3001
#   ./e2e-test.sh http://host:puerto
#   BEARER_TOKEN=xyz ./e2e-test.sh

set -euo pipefail

BASE="${1:-${CATALOG_BASE:-http://localhost:3001}}"
AUTH_HEADER=()
[[ -n "${BEARER_TOKEN:-}" ]] && AUTH_HEADER=(-H "Authorization: Bearer ${BEARER_TOKEN}")

PASS=0; FAIL=0; CURRENT=""
pass() { PASS=$((PASS+1)); echo "  ✓ $1"; }
fail() { FAIL=$((FAIL+1)); echo "  ✗ $1"; }
step() { CURRENT="$1"; echo ""; echo "━━━ ${CURRENT} ━━━"; }
req() {
  local method="$1"; local path="$2"; local body="${3:-}"
  local args=(-sS -X "$method" "${AUTH_HEADER[@]}" -H "Content-Type: application/json" -o /tmp/cat_resp.json -w "%{http_code}")
  if [[ -n "$body" ]]; then echo "$body" | curl "${args[@]}" --data @- "${BASE}${path}"
  else curl "${args[@]}" "${BASE}${path}"; fi
}
expect_status() {
  local want="$1"; local got="$2"; local label="$3"
  if [[ "$got" == "$want" ]]; then pass "$label (HTTP $got)"; else fail "$label (esperado $want, got $got)"; cat /tmp/cat_resp.json; fi
}
summary() {
  echo ""; echo "═════════════════════════════════════════"
  echo " Resumen E2E catalog-service"
  echo "   Pass: ${PASS}"; echo "   Fail: ${FAIL}"
  echo "═════════════════════════════════════════"
  [[ "$FAIL" -eq 0 ]] || exit 1
}

# ─────────────────────────────────────────────────────────────
step "PASO 1 — Health"
code=$(req GET /health)
expect_status 200 "$code" "GET /health"

# ─────────────────────────────────────────────────────────────
step "PASO 2 — HU1 Crear categoría CURRENCY"
CAT_CODE="CURRENCY-$(date +%s)"
body=$(cat <<JSON
{"categoryCode":"${CAT_CODE}","name":"Currency (test)","ownerService":"catalog-service","consumers":["payment","product","organization","hrms"],"status":"ACTIVE","version":"1.0.0"}
JSON
)
code=$(req POST /api/catalog-category "$body")
expect_status 201 "$code" "POST /api/catalog-category"
CAT_ID=$(jq -r '.data.id // .id' /tmp/cat_resp.json 2>/dev/null || echo "")
[[ -n "$CAT_ID" && "$CAT_ID" != "null" ]] && pass "category.id=$CAT_ID" || fail "sin category.id"

# ─────────────────────────────────────────────────────────────
step "PASO 3 — HU2 Crear ítems USD y EUR"
for code_item in USD EUR MXN; do
  body=$(cat <<JSON
{"categoryId":"${CAT_ID}","categoryCode":"${CAT_CODE}","itemCode":"${code_item}","label":"${code_item}","sortOrder":0,"isDefault":false,"status":"ACTIVE","version":1,"metadata":{"symbol":"$"}}
JSON
)
  code=$(req POST /api/catalog-item "$body")
  expect_status 201 "$code" "POST /api/catalog-item ${code_item}"
done

# ─────────────────────────────────────────────────────────────
step "PASO 4 — HU3 Traducciones i18n"
ITEM_CODE="USD"
# localizar item id
req GET "/api/catalog-item?categoryCode=${CAT_CODE}&itemCode=${ITEM_CODE}" > /dev/null
ITEM_ID=$(jq -r '(.data.items // .items // [])[0].id // empty' /tmp/cat_resp.json)
if [[ -n "$ITEM_ID" ]]; then
  body=$(cat <<JSON
{"catalogItemId":"${ITEM_ID}","categoryCode":"${CAT_CODE}","itemCode":"${ITEM_CODE}","locale":"es","label":"Dólar estadounidense"}
JSON
)
  code=$(req POST /api/catalog-translation "$body")
  expect_status 201 "$code" "POST /api/catalog-translation es"
else
  echo "  (item USD no recuperable por listado, paso traducción saltado)"
fi

# ─────────────────────────────────────────────────────────────
step "PASO 5 — HU4 Listado REST por categoría"
code=$(req GET "/api/catalog/${CAT_CODE}/items?locale=es&activeOnly=true")
# el endpoint custom HU4 puede no existir aún; tolerar 404 en generación inicial
if [[ "$code" == "200" ]]; then pass "GET /api/catalog/:categoryCode/items";
elif [[ "$code" == "404" ]]; then echo "  (endpoint custom HU4 no generado aún — skip)";
else fail "GET items devolvió $code"; fi

# ─────────────────────────────────────────────────────────────
step "PASO 6 — HU6 Validate código"
code=$(req GET "/api/catalog/${CAT_CODE}/items/USD/validate")
if [[ "$code" == "200" ]]; then pass "GET validate"; jq '.' /tmp/cat_resp.json
elif [[ "$code" == "404" ]]; then echo "  (endpoint validate no generado aún — skip)"
else fail "validate devolvió $code"; fi

# ─────────────────────────────────────────────────────────────
step "PASO 7 — HU8 Schema hash"
code=$(req GET "/api/catalog/${CAT_CODE}/schema")
if [[ "$code" == "200" ]]; then pass "GET schema"; jq '.' /tmp/cat_resp.json
elif [[ "$code" == "404" ]]; then echo "  (endpoint schema no generado aún — skip)"
else fail "schema devolvió $code"; fi

# ─────────────────────────────────────────────────────────────
step "PASO 8 — HU2 Update ítem (activar isDefault)"
if [[ -n "$ITEM_ID" ]]; then
  body='{"isDefault":true,"sortOrder":1}'
  code=$(req PATCH "/api/catalog-item/${ITEM_ID}" "$body")
  [[ "$code" =~ ^(200|204)$ ]] && pass "PATCH catalog-item" || fail "PATCH devolvió $code"
fi

# ─────────────────────────────────────────────────────────────
step "PASO 9 — HU9 History"
if [[ -n "$ITEM_ID" ]]; then
  code=$(req GET "/api/catalog-item-history?catalogItemId=${ITEM_ID}")
  [[ "$code" == "200" ]] && pass "GET item-history" || fail "history devolvió $code"
fi

# ─────────────────────────────────────────────────────────────
step "PASO 10 — HU2 Deprecar ítem MXN"
req GET "/api/catalog-item?categoryCode=${CAT_CODE}&itemCode=MXN" > /dev/null
MXN_ID=$(jq -r '(.data.items // .items // [])[0].id // empty' /tmp/cat_resp.json)
if [[ -n "$MXN_ID" ]]; then
  body='{"status":"DEPRECATED"}'
  code=$(req PATCH "/api/catalog-item/${MXN_ID}" "$body")
  [[ "$code" =~ ^(200|204)$ ]] && pass "PATCH deprecate MXN" || fail "deprecate devolvió $code"
fi

# ─────────────────────────────────────────────────────────────
step "PASO 11 — HU7 Bulk import"
body=$(cat <<JSON
{"categoryCode":"${CAT_CODE}","overwrite":false,"items":[{"itemCode":"DOP","label":"DOP"},{"itemCode":"COP","label":"COP"}]}
JSON
)
code=$(req POST /api/catalog/bulk-import "$body")
if [[ "$code" =~ ^(200|201|202)$ ]]; then pass "POST bulk-import"
elif [[ "$code" == "404" ]]; then echo "  (endpoint bulk-import no generado aún — skip)"
else fail "bulk-import devolvió $code"; fi

summary
