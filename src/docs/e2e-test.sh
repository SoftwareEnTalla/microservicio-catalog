#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — catalog-service (puerto 3001)
# Módulos: catalogs, catalogitems, catalogcategorys, catalogtranslations, catalogitemhistorys
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3001/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — Catalog Microservice — 100% UH + Swagger         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/catalogs/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 Catalog"
P=$(cat <<EOF
{"name":"E2E Catalog ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"CAT-${UNIQUE}","version":"v1","status":"ACTIVE","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogs" "$P"

log_step 2 "UH-2 CatalogItem"
P=$(cat <<EOF
{"name":"E2E Item ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"ITEM-${UNIQUE}","categoryCode":"risk-level","value":"LOW",
 "displayLabel":"E2E","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogitems" "$P"

log_step 3 "UH-3 CatalogCategory"
P=$(cat <<EOF
{"name":"E2E Category ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"CATG-${UNIQUE}","displayLabel":"E2E","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogcategorys" "$P"

log_step 4 "UH-4 CatalogTranslation"
P=$(cat <<EOF
{"name":"E2E Trans ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"TR-${UNIQUE}","locale":"es-ES","translatedLabel":"Bajo","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogtranslations" "$P"

log_step 5 "UH-5 CatalogItemHistory"
P=$(cat <<EOF
{"name":"E2E History ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"itemCode":"ITEM-${UNIQUE}","changeType":"CREATE","snapshot":{},"metadata":{"e2e":true}}
EOF
)
smoke_module "catalogitemhistorys" "$P"

log_step 6 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*catalog[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics catalog.* detectados"; else log_warn "Sin topics catalog.*"; fi
else log_warn "kcat no instalado — skipping"; fi

print_summary "catalog-service"
