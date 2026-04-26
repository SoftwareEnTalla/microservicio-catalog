# Catalog Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3001
> **Base URL**: `http://localhost:3001/api`
> **Swagger UI**: `http://localhost:3001/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)
11. [Nomencladores Sembrados (Bootstrap)](#11-nomencladores-sembrados-bootstrap)
12. [Variables de Entorno](#12-variables-de-entorno)
13. [Build & Run](#13-build--run)

---

## 1. Historia de Usuario

### Bounded Context: Catalog

El microservicio **catalog** es la **fuente única de verdad de nomencladores horizontales** del ecosistema (monedas, estados de aprobación, tipos de pasarela, idiomas, etc.). Cada nomenclador vive en una *categoría* y contiene *ítems* versionados con traducciones por locale. Otros bounded contexts consumen catalog vía REST + caché local y Kafka para invalidaciones.

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Gestión de categorías de nomencladores (ownerService, consumers) | catalog-category |
| UH-2 | Ítems del catálogo con code/label multilingüe y estado | catalog-item |
| UH-3 | Historial de versiones del ítem para auditoría y rollback | catalog-item-history |
| UH-4 | Traducciones i18n del ítem por locale BCP47 | catalog-translation |
| UH-5 | Integración con resto de microservicios (consumers) | uh-integration |

### UH-Integration — sincronización con consumidores

**Como** plataforma, **quiero** que cada microservicio consumidor sincronice nomencladores desde catalog **para** garantizar consistencia de códigos sin acoplamiento fuerte.

**Criterios de aceptación:**
- Catalog publica `catalog.catalog-item-upserted`, `catalog.catalog-item-deprecated`, `catalog.catalog-item-archived`, `catalog-bulk-imported`.
- Consumidores mantienen caché local (TTL 5 min) y tabla `catalog_sync_log` con diff {added, updated, removed}.
- Fallback: si catalog está abajo, `CatalogClientService` usa circuit breaker + cache stale.
- Sync en bootstrap (timeout 3 s), scheduled (15 min) y on-demand vía `/api/catalog-sync/run`.

---

## 2. Modelo DSL

Los modelos están en `models/catalog/` y siguen el estándar DSL v2.0.

| Modelo XML | Versión | AggregateRoot | ModuleType | Descripción |
|------------|---------|:---:|---|---|
| `catalog-category.xml` | 1.0.0 | ✓ | aggregate-root | Categoría de nomenclador |
| `catalog-item.xml` | 1.0.0 | ✓ | aggregate-root | Ítem con code único por categoría |
| `catalog-item-history.xml` | 1.0.0 | ✗ | entity | Snapshot histórico (rollback / auditoría) |
| `catalog-translation.xml` | 1.0.0 | ✗ | entity | Traducción i18n por locale BCP47 |

### Estructura de un modelo DSL

```xml
<domain-model name="catalog-item" schemaVersion="2.0" version="1.0.0"
              boundedContext="catalog" aggregateRoot="true" moduleType="aggregate-root">
  <fields>
    <field name="categoryCode" type="string" length="80" searchable="true"/>
    <field name="itemCode" type="string" length="80"/>
    <field name="label" type="string"/>
    <field name="status" type="string" defaultValue="ACTIVE"/>
  </fields>
  <indexes>
    <index name="idx_catalog_item_category_code" unique="true">
      <column>categoryCode</column><column>itemCode</column>
    </index>
  </indexes>
  <domain-events>
    <event name="catalog-item-upserted" version="1.0.0" maxRetries="3" replayable="false"/>
    <event name="catalog-item-deprecated" version="1.0.0" maxRetries="3" replayable="false"/>
  </domain-events>
</domain-model>
```

---

## 3. Arquitectura

### 3.1. Patrones y Estilos

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Separación command/query: controllers, services, repos, handlers independientes. |
| **Event Sourcing** | Todo cambio genera eventos inmutables persistidos en EventStore y publicados a Kafka. |
| **Event-Driven** | Consumidores invalidan caché al recibir `catalog.*`. |
| **Saga Pattern** | Sagas reaccionan a eventos CRUD del propio bounded context. |
| **DDD** | Aggregates *CatalogItem*, *CatalogCategory*. |
| **Hexagonal** | Controllers → services → repositories → adapters Kafka. |
| **Repository Pattern** | CommandRepository / QueryRepository separados. |

### 3.2. Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                CATALOG MICROSERVICE  (3001)                │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│       │               │              │                     │
│  CommandBus     QueryBus        Resolvers                  │
│       │               │                                    │
│  CommandService  QueryService                              │
│       │               │                                    │
│  CommandRepository  QueryRepository                        │
│       │                                                    │
│      PostgreSQL (catalog-service DB · TypeORM)             │
│                                                            │
│  KafkaEventPublisher ←→ EventStore ←→ KafkaEventSubscriber │
└────────────────────────────────────────────────────────────┘
```

### 3.3. Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ (base.event, <entity>*.event, event-registry.ts, exporting.event.ts)
├── graphql/ guards/ interceptors/ modules/ queries/
├── repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

### 4.1 Catalog (agregado genérico)
- **Entidad**: `Catalog` — name, description, type, createdBy, isActive, fechas auditoría.

### 4.2 CatalogCategory
- **Entidad**: `CatalogCategory` — `categoryCode` (unique, ej. CURRENCY), `ownerService`, `consumers` (json), `status`.

### 4.3 CatalogItem
- **Entidad**: `CatalogItem` — `categoryId`, `categoryCode`, `itemCode`, `label`.
- **Índice único compuesto**: `categoryCode + itemCode`.

### 4.4 CatalogItemHistory
- **Entidad**: snapshot inmutable por versión (rollback y auditoría).

### 4.5 CatalogTranslation
- **Entidad**: `catalogItemId + locale` (BCP47) → `label`.

---

## 5. Eventos Publicados

| Módulo | Evento | Tópico Kafka | Versión | Replayable |
|--------|--------|--------------|---------|:---:|
| catalog | `CatalogCreatedEvent` | `catalog-created` | 1.0.0 | ✓ |
| catalog | `CatalogUpdatedEvent` | `catalog-updated` | 1.0.0 | ✓ |
| catalog | `CatalogDeletedEvent` | `catalog-deleted` | 1.0.0 | ✓ |
| catalog-category | `CatalogCategoryCreatedEvent` | `catalog-category-created` | 1.0.0 | ✓ |
| catalog-category | `CatalogCategoryUpdatedEvent` | `catalog-category-updated` | 1.0.0 | ✓ |
| catalog-category | `CatalogCategoryDeletedEvent` | `catalog-category-deleted` | 1.0.0 | ✓ |
| catalog-item | `CatalogItemCreatedEvent` | `catalog-item-created` | 1.0.0 | ✓ |
| catalog-item | `CatalogItemUpdatedEvent` | `catalog-item-updated` | 1.0.0 | ✓ |
| catalog-item | `CatalogItemDeletedEvent` | `catalog-item-deleted` | 1.0.0 | ✓ |
| catalog-item | `CatalogItemUpsertedEvent` | `catalog-item-upserted` | 1.0.0 | ✗ |
| catalog-item | `CatalogItemDeprecatedEvent` | `catalog-item-deprecated` | 1.0.0 | ✗ |
| catalog-item | `CatalogItemArchivedEvent` | `catalog-item-archived` | 1.0.0 | ✗ |
| catalog-item | `CatalogBulkImportedEvent` | `catalog-bulk-imported` | 1.0.0 | ✗ |
| catalog-item-history | `CatalogItemHistoryCreatedEvent` | `catalog-item-history-created` | 1.0.0 | ✓ |
| catalog-item-history | `CatalogItemHistoryUpdatedEvent` | `catalog-item-history-updated` | 1.0.0 | ✓ |
| catalog-item-history | `CatalogItemHistoryDeletedEvent` | `catalog-item-history-deleted` | 1.0.0 | ✓ |
| catalog-item-history | `CatalogItemVersionRecordedEvent` | `catalog-item-version-recorded` | 1.0.0 | ✗ |
| catalog-translation | `CatalogTranslationCreatedEvent` | `catalog-translation-created` | 1.0.0 | ✓ |
| catalog-translation | `CatalogTranslationUpdatedEvent` | `catalog-translation-updated` | 1.0.0 | ✓ |
| catalog-translation | `CatalogTranslationDeletedEvent` | `catalog-translation-deleted` | 1.0.0 | ✓ |
| catalog-translation | `CatalogTranslationUpsertedEvent` | `catalog-translation-upserted` | 1.0.0 | ✓ |

Cada topic genera automáticamente `<topic>-retry` y `<topic>-dlq`.

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* datos de la entidad */ },
    "metadata": {
      "initiatedBy": "user-id",
      "correlationId": "uuid",
      "eventId": "uuid",
      "eventName": "CatalogItemUpsertedEvent",
      "eventVersion": "1.0.0",
      "sourceService": "catalog-service",
      "retryCount": 0,
      "idempotencyKey": "uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

Catalog es **primariamente publicador**. Consume sus propios topics para retry/DLQ y replay.

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| * | `<topic>-retry` | self | Reintento con backoff exponencial |
| * | `<topic>-dlq` | self | Inspección manual / replay |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables; `EventIdempotencyService` deduplica con TTL (`KAFKA_IDEMPOTENCY_TTL_MS`).

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD (todos los módulos)

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/api/<entities>/command` | `CreateXxxDto` | Crear |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` | Crear múltiples |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` | Actualizar |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` | Actualizar múltiples |
| DELETE | `/api/<entities>/command/:id` | — | Eliminar |
| DELETE | `/api/<entities>/command/bulk?ids=` | — | Eliminar múltiples |

### 7.2 Query CRUD (todos los módulos)

| Método | Ruta | Query Params |
|--------|------|--------------|
| GET | `/api/<entities>/query/list` | `page, size, sort, order, search, initDate, endDate` |
| GET | `/api/<entities>/query/:id` | — |
| GET | `/api/<entities>/query/field/:field` | `value, page, size` |
| GET | `/api/<entities>/query/pagination` | `page, size, sort, order` |
| GET | `/api/<entities>/query/count` | — |
| GET | `/api/<entities>/query/search` | `where` |
| GET | `/api/<entities>/query/find-one` | `where` |

### 7.3 Prefijos por módulo

| Módulo | Prefijo Command | Prefijo Query | Auth |
|--------|-----------------|---------------|:---:|
| catalog | `/api/catalogs/command` | `/api/catalogs/query` | — |
| catalog-category | `/api/catalogcategorys/command` | `/api/catalogcategorys/query` | Bearer |
| catalog-item | `/api/catalogitems/command` | `/api/catalogitems/query` | Bearer |
| catalog-item-history | `/api/catalogitemhistorys/command` | `/api/catalogitemhistorys/query` | Bearer |
| catalog-translation | `/api/catalogtranslations/command` | `/api/catalogtranslations/query` | Bearer |

### 7.4 DTOs principales

```json
// CreateCatalogCategoryDto
{ "name":"CURRENCY", "categoryCode":"CURRENCY", "ownerService":"catalog-service",
  "consumers":["payment-service","product-service"], "status":"ACTIVE", "isActive":true }

// CreateCatalogItemDto
{ "name":"Mexican Peso", "categoryId":"UUID", "categoryCode":"CURRENCY",
  "itemCode":"MXN", "label":"Mexican Peso", "status":"ACTIVE" }

// CreateCatalogTranslationDto
{ "catalogItemId":"UUID", "categoryCode":"CURRENCY", "itemCode":"MXN",
  "locale":"es-MX", "label":"Peso mexicano" }
```

---

## 8. Guía para Desarrolladores

### 8.1 Crear un Evento

```typescript
// src/modules/catalog-item/events/catalogitem-upserted.event.ts
export class CatalogItemUpsertedEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<CatalogItem>) { super(aggregateId); }
  static create(id: string, instance: CatalogItem, userId: string, correlationId = uuidv4()) {
    return new CatalogItemUpsertedEvent(id, { instance, metadata: { initiatedBy: userId, correlationId } });
  }
}
```

Registrar en `event-registry.ts`:
```typescript
'catalog-item-upserted': createEventDefinition('catalog-item-upserted', CatalogItemUpsertedEvent,
  { version:'1.0.0', maxRetries:3, replayable:false }),
```

Publicar desde servicio:
```typescript
const event = CatalogItemUpsertedEvent.create(saved.id, saved, userId);
this.eventBus.publish(event as any);   // EventBus local → sagas
await this.eventPublisher.publish(event); // Kafka → cross-service
```

### 8.2 Crear una Saga

```typescript
@Injectable()
export class CatalogItemCrudSaga {
  constructor(private readonly commandBus: CommandBus) {}
  @Saga()
  onUpserted = ($e: Observable<CatalogItemUpsertedEvent>) => $e.pipe(
    ofType(CatalogItemUpsertedEvent),
    tap(e => Logger.log(`Saga: ítem upserted ${e.aggregateId}`)),
    map(() => null),
  );
}
```

---

## 9. Test E2E con curl

```bash
cd catalog-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash catalog-service/src/docs/e2e-test.sh
```

Cobertura objetivo 100% UH + Swagger + Kafka:

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health + DB baseline | Infra |
| 1 | Crear categoría CURRENCY | `catalog-category` |
| 2 | Crear ítem MXN | `catalog-item` |
| 3 | Traducción es-MX | `catalog-translation` |
| 4 | Historial de versión del ítem | `catalog-item-history` |
| 5 | Query por categoryCode | `catalog-item` |
| 6 | Bulk-import (5 ítems) → `catalog-bulk-imported` | Kafka produce |
| 7 | Deprecar ítem → `catalog-item-deprecated` | Kafka produce |
| 8 | Archivar ítem → `catalog-item-archived` | Kafka produce |
| 9 | Upsert translation → `catalog-translation-upserted` | Kafka produce |
| 10 | `kcat -L` verifica topics `catalog-item-*` | Kafka probe |
| 11 | Limpieza (DELETE de entidades creadas) | Todos |

Requisitos: catalog-service ↑, PostgreSQL `catalog-service` DB, `curl` + `jq`; `kcat` opcional.

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

| Módulo | Saga | Handlers |
|--------|------|----------|
| catalog | `CatalogCrudSaga` | onCatalogCreated/Updated/Deleted |
| catalog-category | `CatalogCategoryCrudSaga` | onCatalogCategoryCreated/Updated/Deleted |
| catalog-item | `CatalogItemCrudSaga` | onCatalogItemCreated/Updated/Deleted |
| catalog-item-history | `CatalogItemHistoryCrudSaga` | onCatalogItemHistoryCreated/Updated/Deleted |
| catalog-translation | `CatalogTranslationCrudSaga` | onCatalogTranslationCreated/Updated/Deleted |

### 10.2 Totales

- **Eventos registrados**: 21 (15 CRUD + 6 dominio)
- **Topics Kafka**: 21 main + 21 retry + 21 DLQ = **63**

### 10.3 Dual publish

Si las sagas CRUD no se disparan, es porque los repositorios publican sólo a Kafka. Para activar sagas en-process use dual publish (`eventBus.publish()` + `eventPublisher.publish()`).

---

## 11. Nomencladores Sembrados (Bootstrap)

Al arrancar `catalog-service`, los scripts SQL idempotentes en [src/database/](../database/) (ejecutados vía DSL §4.9) cargan las categorías e ítems de los nomencladores horizontales del ecosistema:

- [postgres-1-catalog-categories.sql](../database/postgres-1-catalog-categories.sql) — categorías + `consumers`.
- [postgres-2-catalog-items.sql](../database/postgres-2-catalog-items.sql) — ítems por categoría.
- [postgres-3-catalog-translations.sql](../database/postgres-3-catalog-translations.sql) — traducciones `es` y `en`.
- [init-order.txt](../database/init-order.txt) — orden de ejecución.

### 11.1 Regla de gobierno (estricta)

> **catalog-service almacena únicamente nomencladores compartidos por al menos 2 microservicios consumidores.**
>
> - Si un nomenclador lo usa **un solo** microservicio → NO va en catalog-service; permanece como `enum` DSL interno del servicio dueño.
> - Toda categoría sembrada debe declarar **≥ 2 entradas** en su array JSON `consumers`.
> - El único dueño de la categoría en catalog-service es `ownerService = 'catalog-service'`; los consumidores se enumeran en `consumers`.
> - El sync de cada microservicio reconcilia siempre **a favor de los valores de catalog-service** (verdad mandataria). Los consumidores solo proveen valores locales como **fallback** cuando catalog-service está caído.

**Categorías removidas por incumplir la regla** (anteriormente sembradas):

| Removida | Motivo |
|---|---|
| `CATALOG_STATUS` | Solo lo consume `catalog-service` (estado interno de items/categorías). |
| `PAYMENT_ATTEMPT_STATUS` | Solo lo consume `payment-service` (sub-estado interno del agregado `payment-attempt`). |
| `EMPLOYEE_STATUS` | Solo lo consume `hrms-service` (ciclo laboral interno del agregado `employee`). |

### 11.2 Catálogo vigente (17 categorías)

| # | `categoryCode` | Ítems sembrados | Consumidores (`consumers`) | Origen DSL detectado |
|---|---|---|---|---|
| 1 | `CURRENCY` | USD, EUR, GBP, MXN, DOP, COP, CUP, BRL, ARS, CLP, PEN, CAD, JPY, CNY, CHF | payment, product, hrms, crm, organization, invoice, orders, salesmanager, merchant | `payment.currency`, `payment-attempt.currency`, `product-price.currency`, `product-variant.currency`, `crm/contract.currency`, `crm/subscription-plan.currency`, `crm/payment-milestone.currency`, `hrms/payroll.currency`, `hrms/employee.currency`, `organization/*.currency` |
| 2 | `COUNTRY` | CU, US, MX, ES, CO, DO, PE, AR, CL, BR, EC, VE, CA, GB, FR, DE, IT, PT | security, customer, merchant, organization, crm, hrms, client, salesmanager | `crm/provider.country`, `organization/organization.country`, `security/user-profile.country` |
| 3 | `LOCALE` | es, en, pt, fr, es-MX, es-ES, es-CU, en-US, en-GB, pt-BR, pt-PT, fr-FR, it, de | catalog, security, customer, merchant, product, crm, hrms, client | `catalog/catalog-translation.locale`, `security/user-profile.language`, i18n horizontal |
| 4 | `GENDER` | MALE, FEMALE, OTHER, NOT_DECLARED | hrms, customer, security, client, crm | `hrms/person.gender` |
| 5 | `DOCUMENT_TYPE` | NATIONAL_ID, PASSPORT, FOREIGN_ID, TAX_ID, DRIVER_LICENSE, OTHER | hrms, crm, client, customer, merchant, security, salesmanager | `hrms/person.documentType` (autoritativo) → mirror en `crm/provider.documentType`, `client/client.documentType` |
| 6 | `APPROVAL_STATUS` | DRAFT, PENDING, APPROVED, REJECTED, SUSPENDED | security, merchant, salesmanager, crm | `security/security-merchant.approvalStatus`, `security/sales-manager.approvalStatus`, `salesmanager/salesmanager.approvalStatus`, `merchant/merchant.approvalStatus` |
| 7 | `GENERIC_STATUS` | ACTIVE, INACTIVE | product, crm, hrms, organization | `product/product-media.status`, `product/product-variant.status`, `product/product-relationship.status`, `crm/provider.status` |
| 8 | `CONTRACT_STATUS` | DRAFT, ACTIVE, SUSPENDED, TERMINATED, EXPIRED, PENDING | crm, salesmanager, merchant | `crm/contract.status`, `salesmanager/salesmanager-merchant-contract.status` |
| 9 | `PAYMENT_STATUS` | CREATED, PENDING, REQUIRES_CUSTOMER_ACTION, AUTHORIZED, SUCCEEDED, FAILED, CANCELLED, EXPIRED | payment, orders, invoice | `payment/payment.status` |
| 10 | `PAYMENT_GATEWAY_STATUS` | DRAFT, ACTIVE, INACTIVE, MAINTENANCE, DEPRECATED | payment, merchant | `payment/payment-gateway.status` |
| 11 | `GATEWAY_ELIGIBILITY_STATUS` | NOT_STARTED, IN_PROGRESS, APPROVED, REJECTED, EXPIRED, BLOCKED | payment, customer, merchant | `payment/payment-customer-gateway-eligibility.status`, `customer/customer-gateway-onboarding.status` |
| 12 | `MERCHANT_GATEWAY_STATUS` | NOT_CONFIGURED, ONBOARDING, ACTIVE, SUSPENDED, ERROR | merchant, payment | `merchant/merchant-gateway-config.status`, mirror en `payment/payment-merchant-gateway-eligibility.status` |
| 13 | `ORDER_STATUS` | DRAFT, PLACED, CONFIRMED, IN_PROGRESS, FULFILLED, DELIVERED, CANCELLED, REFUNDED, RETURNED | orders, invoice, payment, product | Saga orders ↔ invoice ↔ payment (orders-service aún sin DSL; valores estandarizados) |
| 14 | `INVOICE_STATUS` | DRAFT, ISSUED, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED, VOID, REFUNDED | invoice, orders, payment | invoice-service aún sin DSL; valores estandarizados |
| 15 | `PRODUCT_STATUS` | DRAFT, ACTIVE, OUT_OF_STOCK, ARCHIVED, DISCONTINUED | product, orders | `product/product.status` (`DRAFT,ACTIVE,ARCHIVED`) ampliado para orders |
| 16 | `LOYALTY_TIER` | BRONZE, SILVER, GOLD, PLATINUM, DIAMOND | client, customer, crm | `client/client-loyalty-tier` (aggregate) |
| 17 | `BUSINESS_DOC_TYPE` | INVOICE, CREDIT_NOTE, DEBIT_NOTE, RECEIPT, CONTRACT, NDA, PURCHASE_ORDER, QUOTE | invoice, crm, hrms, salesmanager | Tipos de documento generables (OnlyOffice + plantillas) |

### 11.3 Verificación de la regla

```sql
-- Toda categoría debe tener ≥ 2 consumidores. Esta consulta NO debe retornar filas.
SELECT "categoryCode", json_array_length("consumers") AS num_consumers
FROM "catalog_category_base_entity"
WHERE "type" = 'catalogcategory'
  AND ("consumers" IS NULL OR json_array_length("consumers") < 2);
```

### 11.4 Cómo añadir un nuevo nomenclador

1. Verificar que **al menos 2 microservicios** lo necesiten. Si solo uno → mantenerlo como `enum` DSL local.
2. Añadir el `INSERT` de la categoría en [postgres-1-catalog-categories.sql](../database/postgres-1-catalog-categories.sql) con `consumers` JSON conteniendo ≥2 servicios.
3. Añadir el bloque de ítems en [postgres-2-catalog-items.sql](../database/postgres-2-catalog-items.sql).
4. Añadir traducciones `es` y `en` en [postgres-3-catalog-translations.sql](../database/postgres-3-catalog-translations.sql).
5. Cada microservicio consumidor declara la categoría en su env `CATALOG_CATEGORIES=...` para que `CatalogSyncService` la sincronice.
6. Mantener el seed local del consumidor en su DSL (fallback) reflejando exactamente los mismos `itemCode`s. Catalog es la verdad mandataria.

---

## 12. Variables de Entorno

| Variable | Default | Uso |
|----------|---------|-----|
| `DB_HOST/PORT/USERNAME/PASSWORD/NAME` | localhost:5432/postgres/postgres/catalog-service | PostgreSQL |
| `KAFKA_ENABLED` | true | Habilita Kafka |
| `KAFKA_BROKERS` | kafka:9092 | Brokers |
| `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | nestjs-client/nestjs-group | Kafka identidad |
| `KAFKA_IDEMPOTENCY_TTL_MS` | 86400000 | 24 h idempotencia |
| `KAFKA_TRUSTED_PRODUCERS` | — | CSV productores confiables |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` | true/false | Event sourcing |
| `REDIS_HOST/PORT/TTL` | data-center-redis:6379/60 | Caché |
| `LOG_API_BASE_URL` | http://codetrace-service:3002/api | Codetrace |
| `LOG_EXECUTION_TIME` | false | `@LogExecutionTime` |
| `LOG_KAFKA_TOPIC` | codetrace-execution-trace | Topic trazas |
| `APP_NAME` | catalog-service | Nombre app |

---

## 13. Build & Run

```bash
cd catalog-service
npm install
npm run build
node dist/main.js
# o con docker
docker-compose up catalog-service
```
