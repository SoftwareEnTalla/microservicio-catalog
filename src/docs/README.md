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

## 11. Variables de Entorno

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

## 12. Build & Run

```bash
cd catalog-service
npm install
npm run build
node dist/main.js
# o con docker
docker-compose up catalog-service
```
