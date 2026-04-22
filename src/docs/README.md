# catalog-service

Microservicio NestJS que centraliza **nomencladores y enumeradores horizontales** (usados por 2+ microservicios) con soporte i18n, versionado, eventos Kafka y API REST/GraphQL. Los ms consumidores implementan el patrón **catalog-fallback**: si catalog-service está accesible lo usan como fuente de verdad; si no, operan con su enum local embebido.

- **Puerto**: `3001`
- **Bounded context**: `catalog`
- **Arquitectura**: NestJS 11 + CQRS + Event Sourcing + Kafka + Postgres + Redis + GraphQL
- **Generado desde**: `models/catalog/*.xml` + `user-histories/catalog/*.txt`

## Módulos de dominio

| Módulo | Agregado | Descripción |
|--------|----------|-------------|
| `catalog-category` | CatalogCategory (root) | Agrupa ítems por código único (CURRENCY, APPROVAL_STATUS...) |
| `catalog-item` | CatalogItem (root) | Ítem dentro de una categoría (USD, PENDING...) con metadata |
| `catalog-translation` | CatalogTranslation | Traducción i18n de `label` / `description` por locale BCP47 |
| `catalog-item-history` | CatalogItemHistory | Snapshots versionados para auditoría/rollback |

## Categorías horizontales servidas

| Categoría | Consumidores |
|-----------|--------------|
| `CURRENCY` | product, payment, organization, hrms |
| `APPROVAL_STATUS` | merchant, salesmanager, security |
| `RISK_LEVEL` | customer, security, hrms/access-control |
| `ONBOARDING_STATUS` | customer, payment |
| `GATEWAY_STATUS` | merchant, payment |
| `SETTLEMENT_MODE` | merchant, payment |
| `EAV_DATA_TYPE` | hrms, product, organization |
| `COUNTRY_ISO2` | organization, hrms/person, customer, merchant |
| `LANGUAGE_BCP47` | i18n transversal |
| `TIMEZONE_IANA` | hrms/access-control, organization, payment |

## Endpoints REST clave

- `GET /api/catalog/:categoryCode/items?locale=es&activeOnly=true` – listado ordenado y localizado, cacheable con ETag + `Cache-Control: public, max-age=300`.
- `GET /api/catalog/:categoryCode/items/:itemCode/validate?at=YYYY-MM-DDThh:mm:ssZ` – `{ valid, reason? }` considerando `status` y `validFrom/validTo`.
- `GET /api/catalog/:categoryCode/schema` – `{ version, hash, itemsCount, updatedAt }` para que consumidores decidan si refrescar caché.
- `GET /api/catalog/:categoryCode/items/:itemCode/history` – versiones previas.
- `POST /api/catalog/bulk-import` – seed masivo (requiere rol `CATALOG_ADMIN`).

## Eventos publicados (Kafka)

- `catalog.catalog-category-created|updated|deprecated`
- `catalog.catalog-item-upserted`
- `catalog.catalog-item-deprecated`
- `catalog.catalog-item-archived`
- `catalog.catalog-translation-upserted|deleted`
- `catalog.catalog-bulk-imported`
- `catalog.catalog-item-version-recorded`

## Patrón catalog-fallback (OBLIGATORIO en consumidores)

Cada microservicio consumidor:
1. Mantiene el enum localmente en su DSL como **fallback**.
2. Al arrancar y periódicamente hace probe a `GET /health` de catalog con timeout ≤ 800 ms.
3. Si `UP`: obtiene ítems vía REST (caché Redis local 5 min) y consume `catalog.catalog-item-upserted` para invalidación.
4. Si `DOWN`: usa **exclusivamente** el enum local; no debe fallar.
5. Implementa circuit-breaker (timeout 500 ms, errorThresholdPercentage 50, resetTimeout 30 s).

## Roles

- `CATALOG_ADMIN` – CRUD de categorías/ítems/traducciones, bulk-import, rollback.
- `CATALOG_CONSUMER` – lectura (asignado a los ms autenticados).
- `CATALOG_AUDITOR` – sólo historial y auditoría.

## E2E tests

`src/docs/e2e-test.sh` cubre HU1-HU10 (CRUD de categoría e ítem, i18n, validate, schema/hash, history, bulk-import).
