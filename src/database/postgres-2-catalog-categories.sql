-- =====================================================================
-- Catalog Service · Seed 1/3 · Categorías (nomencladores horizontales)
-- =====================================================================
-- Idempotente: ON CONFLICT ("categoryCode") DO UPDATE.
-- Tabla destino: catalog_category_base_entity (Single Table Inheritance,
-- discriminador "type" = 'catalogcategory').
-- Las columnas en camelCase se citan con comillas dobles porque la
-- entidad TypeORM no usa naming strategy (DefaultNamingStrategy).
--
-- ─────────────────────────────────────────────────────────────────────
-- REGLA DE GOBIERNO (estricta — ver docs/README.md §11):
-- catalog-service almacena ÚNICAMENTE nomencladores compartidos por
-- ≥ 2 microservicios consumidores. Nomencladores específicos de un
-- solo microservicio NO se sembran aquí; permanecen como enums DSL
-- internos del servicio dueño. Toda categoría sembrada debe declarar
-- al menos 2 entradas en su array JSON "consumers".
--
-- Categorías removidas por incumplir la regla (≥ 2 consumidores):
--   • CATALOG_STATUS         → solo catalog-service (estado interno)
--   • PAYMENT_ATTEMPT_STATUS → solo payment-service (sub-estado interno)
--   • EMPLOYEE_STATUS        → solo hrms-service (ciclo laboral interno)
-- ─────────────────────────────────────────────────────────────────────
-- =====================================================================

INSERT INTO "catalog_category_base_entity"
  ("id", "type", "creationDate", "modificationDate", "createdBy", "isActive",
   "name", "description",
   "categoryCode", "ownerService", "consumers", "status", "version", "itemsCount", "metadata")
VALUES
  -- 1. Monedas ISO-4217 (consumido por payment, product, hrms, organization, crm)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Currency', 'Monedas ISO-4217 reutilizables por todo el ecosistema',
   'CURRENCY', 'catalog-service',
   '["payment-service","product-service","hrms-service","crm-service","organization-service","invoice-service","orders-service","salesmanager-service","merchant-service"]'::json,
   'ACTIVE', '1.0.0', 0, '{"standard":"ISO-4217"}'::json),

  -- 2. Países ISO-3166-1 alpha-2
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Country', 'Países ISO-3166-1 alpha-2',
   'COUNTRY', 'catalog-service',
   '["security-service","customer-service","merchant-service","organization-service","crm-service","hrms-service","client-service","salesmanager-service"]'::json,
   'ACTIVE', '1.0.0', 0, '{"standard":"ISO-3166-1-alpha-2"}'::json),

  -- 3. Locales BCP-47
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Locale', 'Locales BCP-47 soportados por la plataforma',
   'LOCALE', 'catalog-service',
   '["catalog-service","security-service","customer-service","merchant-service","product-service","crm-service","hrms-service","client-service"]'::json,
   'ACTIVE', '1.0.0', 0, '{"standard":"BCP-47"}'::json),

  -- 4. Géneros (hrms/person, customer, security)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Gender', 'Géneros para personas físicas',
   'GENDER', 'catalog-service',
   '["hrms-service","customer-service","security-service","client-service","crm-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 5. Tipos de documento de identidad
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Document type', 'Tipos de documento de identidad',
   'DOCUMENT_TYPE', 'catalog-service',
   '["hrms-service","crm-service","client-service","customer-service","merchant-service","security-service","salesmanager-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 6. Estado de aprobación operativa (security-merchant, sales-manager, salesmanager, merchant)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Approval status', 'Estado de aprobación operativa para entidades comerciales',
   'APPROVAL_STATUS', 'catalog-service',
   '["security-service","merchant-service","salesmanager-service","crm-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 7. Estado genérico binario (ACTIVE/INACTIVE)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Generic status', 'Estado genérico ACTIVE/INACTIVE',
   'GENERIC_STATUS', 'catalog-service',
   '["product-service","crm-service","hrms-service","organization-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 8. Estado de contrato (crm/contract, salesmanager-merchant-contract)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Contract status', 'Estado del ciclo de vida de un contrato',
   'CONTRACT_STATUS', 'catalog-service',
   '["crm-service","salesmanager-service","merchant-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 10. Estado de pago (payment.payment.status)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Payment status', 'Estado de un pago',
   'PAYMENT_STATUS', 'catalog-service',
   '["payment-service","orders-service","invoice-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 11. Estado de pasarela de pago
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Payment gateway status', 'Estado operativo de una pasarela de pago',
   'PAYMENT_GATEWAY_STATUS', 'catalog-service',
   '["payment-service","merchant-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 13. Estado de elegibilidad de pasarela (cliente o merchant)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Gateway eligibility status', 'Estado de onboarding/elegibilidad para una pasarela',
   'GATEWAY_ELIGIBILITY_STATUS', 'catalog-service',
   '["payment-service","customer-service","merchant-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 14. Estado de configuración de pasarela del merchant
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Merchant gateway config status', 'Estado de configuración merchant↔gateway',
   'MERCHANT_GATEWAY_STATUS', 'catalog-service',
   '["merchant-service","payment-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 15. Estado de orden de compra
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Order status', 'Estado de una orden de compra',
   'ORDER_STATUS', 'catalog-service',
   '["orders-service","invoice-service","payment-service","product-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 16. Estado de factura
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Invoice status', 'Estado de una factura',
   'INVOICE_STATUS', 'catalog-service',
   '["invoice-service","orders-service","payment-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 17. Estado de producto
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Product status', 'Estado del ciclo de vida de un producto',
   'PRODUCT_STATUS', 'catalog-service',
   '["product-service","orders-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 18. Niveles de fidelización (client-loyalty-tier)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Loyalty tier', 'Niveles de fidelización de clientes',
   'LOYALTY_TIER', 'catalog-service',
   '["client-service","customer-service","crm-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL),

  -- 18. Tipos de documento corporativo (recibo, contrato, NDA, etc.)
  (uuid_generate_v4(), 'catalogcategory', NOW(), NOW(), 'system', true,
   'Business document type', 'Tipos de documentos corporativos generables (factura, NDA, contrato...)',
   'BUSINESS_DOC_TYPE', 'catalog-service',
   '["invoice-service","crm-service","hrms-service","salesmanager-service"]'::json,
   'ACTIVE', '1.0.0', 0, NULL)

ON CONFLICT ("categoryCode") DO UPDATE SET
  "modificationDate" = NOW(),
  "name"            = EXCLUDED."name",
  "description"     = EXCLUDED."description",
  "ownerService"    = EXCLUDED."ownerService",
  "consumers"       = EXCLUDED."consumers",
  "status"          = EXCLUDED."status",
  "version"         = EXCLUDED."version",
  "metadata"        = EXCLUDED."metadata";
