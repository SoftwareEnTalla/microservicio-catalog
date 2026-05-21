-- =====================================================================
-- Catalog Service · Seed 3/3 · Traducciones (es, en) de los ítems
-- =====================================================================
-- Idempotente: ON CONFLICT ("catalogItemId","locale") DO UPDATE.
-- Tabla destino: catalog_translation_base_entity (STI; type='catalogtranslation').
-- Resuelve catalogItemId por (categoryCode, itemCode).
-- =====================================================================

-- Helper común: para cada (categoryCode, itemCode, locale, label_es, label_en) genera 2 filas.
-- Estrategia: usamos un VALUES con (categoryCode,itemCode,label_es,label_en) y
-- desplegamos en filas con UNION ALL por locale.

INSERT INTO "catalog_translation_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description",
   "catalogItemId","categoryCode","itemCode","locale","label","metadata")
SELECT uuid_generate_v4(),'catalogtranslation',NOW(),NOW(),'system',true,
       ci."itemCode" || '-' || t.locale, ci."itemCode" || ' (' || t.locale || ')',
       ci."id", ci."categoryCode", ci."itemCode", t.locale, t.label, NULL
FROM "catalog_item_base_entity" ci
JOIN (
  -- =========================== CURRENCY ===========================
  VALUES
  ('CURRENCY','USD','es','Dólar estadounidense'),('CURRENCY','USD','en','US Dollar'),
  ('CURRENCY','EUR','es','Euro'),                ('CURRENCY','EUR','en','Euro'),
  ('CURRENCY','GBP','es','Libra esterlina'),     ('CURRENCY','GBP','en','Pound Sterling'),
  ('CURRENCY','MXN','es','Peso mexicano'),       ('CURRENCY','MXN','en','Mexican Peso'),
  ('CURRENCY','DOP','es','Peso dominicano'),     ('CURRENCY','DOP','en','Dominican Peso'),
  ('CURRENCY','COP','es','Peso colombiano'),     ('CURRENCY','COP','en','Colombian Peso'),
  ('CURRENCY','CUP','es','Peso cubano'),         ('CURRENCY','CUP','en','Cuban Peso'),
  ('CURRENCY','BRL','es','Real brasileño'),      ('CURRENCY','BRL','en','Brazilian Real'),
  ('CURRENCY','ARS','es','Peso argentino'),      ('CURRENCY','ARS','en','Argentine Peso'),
  ('CURRENCY','CLP','es','Peso chileno'),        ('CURRENCY','CLP','en','Chilean Peso'),
  ('CURRENCY','PEN','es','Sol peruano'),         ('CURRENCY','PEN','en','Peruvian Sol'),
  ('CURRENCY','CAD','es','Dólar canadiense'),    ('CURRENCY','CAD','en','Canadian Dollar'),
  ('CURRENCY','JPY','es','Yen japonés'),         ('CURRENCY','JPY','en','Japanese Yen'),
  ('CURRENCY','CNY','es','Yuan'),                ('CURRENCY','CNY','en','Yuan Renminbi'),
  ('CURRENCY','CHF','es','Franco suizo'),        ('CURRENCY','CHF','en','Swiss Franc'),

  -- =========================== COUNTRY ===========================
  ('COUNTRY','CU','es','Cuba'),                  ('COUNTRY','CU','en','Cuba'),
  ('COUNTRY','US','es','Estados Unidos'),        ('COUNTRY','US','en','United States'),
  ('COUNTRY','MX','es','México'),                ('COUNTRY','MX','en','Mexico'),
  ('COUNTRY','ES','es','España'),                ('COUNTRY','ES','en','Spain'),
  ('COUNTRY','CO','es','Colombia'),              ('COUNTRY','CO','en','Colombia'),
  ('COUNTRY','DO','es','República Dominicana'),  ('COUNTRY','DO','en','Dominican Republic'),
  ('COUNTRY','PE','es','Perú'),                  ('COUNTRY','PE','en','Peru'),
  ('COUNTRY','AR','es','Argentina'),             ('COUNTRY','AR','en','Argentina'),
  ('COUNTRY','CL','es','Chile'),                 ('COUNTRY','CL','en','Chile'),
  ('COUNTRY','BR','es','Brasil'),                ('COUNTRY','BR','en','Brazil'),
  ('COUNTRY','EC','es','Ecuador'),               ('COUNTRY','EC','en','Ecuador'),
  ('COUNTRY','VE','es','Venezuela'),             ('COUNTRY','VE','en','Venezuela'),
  ('COUNTRY','CA','es','Canadá'),                ('COUNTRY','CA','en','Canada'),
  ('COUNTRY','GB','es','Reino Unido'),           ('COUNTRY','GB','en','United Kingdom'),
  ('COUNTRY','FR','es','Francia'),               ('COUNTRY','FR','en','France'),
  ('COUNTRY','DE','es','Alemania'),              ('COUNTRY','DE','en','Germany'),
  ('COUNTRY','IT','es','Italia'),                ('COUNTRY','IT','en','Italy'),
  ('COUNTRY','PT','es','Portugal'),              ('COUNTRY','PT','en','Portugal'),

  -- =========================== GENDER ===========================
  ('GENDER','MALE','es','Masculino'),            ('GENDER','MALE','en','Male'),
  ('GENDER','FEMALE','es','Femenino'),           ('GENDER','FEMALE','en','Female'),
  ('GENDER','OTHER','es','Otro'),                ('GENDER','OTHER','en','Other'),
  ('GENDER','NOT_DECLARED','es','No declarado'), ('GENDER','NOT_DECLARED','en','Not declared'),

  -- ======================= DOCUMENT_TYPE =========================
  ('DOCUMENT_TYPE','NATIONAL_ID','es','Documento de identidad'), ('DOCUMENT_TYPE','NATIONAL_ID','en','National ID'),
  ('DOCUMENT_TYPE','PASSPORT','es','Pasaporte'),                  ('DOCUMENT_TYPE','PASSPORT','en','Passport'),
  ('DOCUMENT_TYPE','FOREIGN_ID','es','Documento extranjero'),     ('DOCUMENT_TYPE','FOREIGN_ID','en','Foreign ID'),
  ('DOCUMENT_TYPE','TAX_ID','es','RFC / NIF / Tax ID'),           ('DOCUMENT_TYPE','TAX_ID','en','Tax ID'),
  ('DOCUMENT_TYPE','DRIVER_LICENSE','es','Licencia de conducir'), ('DOCUMENT_TYPE','DRIVER_LICENSE','en','Driver license'),
  ('DOCUMENT_TYPE','OTHER','es','Otro'),                          ('DOCUMENT_TYPE','OTHER','en','Other'),

  -- ====================== APPROVAL_STATUS ========================
  ('APPROVAL_STATUS','DRAFT','es','Borrador'),       ('APPROVAL_STATUS','DRAFT','en','Draft'),
  ('APPROVAL_STATUS','PENDING','es','Pendiente'),    ('APPROVAL_STATUS','PENDING','en','Pending'),
  ('APPROVAL_STATUS','APPROVED','es','Aprobado'),    ('APPROVAL_STATUS','APPROVED','en','Approved'),
  ('APPROVAL_STATUS','REJECTED','es','Rechazado'),   ('APPROVAL_STATUS','REJECTED','en','Rejected'),
  ('APPROVAL_STATUS','SUSPENDED','es','Suspendido'), ('APPROVAL_STATUS','SUSPENDED','en','Suspended'),

  -- ====================== GENERIC_STATUS =========================
  ('GENERIC_STATUS','ACTIVE','es','Activo'),     ('GENERIC_STATUS','ACTIVE','en','Active'),
  ('GENERIC_STATUS','INACTIVE','es','Inactivo'), ('GENERIC_STATUS','INACTIVE','en','Inactive'),

  -- ====================== CONTRACT_STATUS ========================
  ('CONTRACT_STATUS','DRAFT','es','Borrador'),         ('CONTRACT_STATUS','DRAFT','en','Draft'),
  ('CONTRACT_STATUS','ACTIVE','es','Activo'),          ('CONTRACT_STATUS','ACTIVE','en','Active'),
  ('CONTRACT_STATUS','SUSPENDED','es','Suspendido'),   ('CONTRACT_STATUS','SUSPENDED','en','Suspended'),
  ('CONTRACT_STATUS','TERMINATED','es','Terminado'),   ('CONTRACT_STATUS','TERMINATED','en','Terminated'),
  ('CONTRACT_STATUS','EXPIRED','es','Expirado'),       ('CONTRACT_STATUS','EXPIRED','en','Expired'),
  ('CONTRACT_STATUS','PENDING','es','Pendiente'),      ('CONTRACT_STATUS','PENDING','en','Pending'),

  -- ====================== PAYMENT_STATUS =========================
  ('PAYMENT_STATUS','CREATED','es','Creado'),                       ('PAYMENT_STATUS','CREATED','en','Created'),
  ('PAYMENT_STATUS','PENDING','es','Pendiente'),                    ('PAYMENT_STATUS','PENDING','en','Pending'),
  ('PAYMENT_STATUS','REQUIRES_CUSTOMER_ACTION','es','Requiere acción del cliente'), ('PAYMENT_STATUS','REQUIRES_CUSTOMER_ACTION','en','Requires customer action'),
  ('PAYMENT_STATUS','AUTHORIZED','es','Autorizado'),                ('PAYMENT_STATUS','AUTHORIZED','en','Authorized'),
  ('PAYMENT_STATUS','SUCCEEDED','es','Exitoso'),                    ('PAYMENT_STATUS','SUCCEEDED','en','Succeeded'),
  ('PAYMENT_STATUS','FAILED','es','Fallido'),                       ('PAYMENT_STATUS','FAILED','en','Failed'),
  ('PAYMENT_STATUS','CANCELLED','es','Cancelado'),                  ('PAYMENT_STATUS','CANCELLED','en','Cancelled'),
  ('PAYMENT_STATUS','EXPIRED','es','Expirado'),                     ('PAYMENT_STATUS','EXPIRED','en','Expired'),

  -- ================== PAYMENT_GATEWAY_STATUS =====================
  ('PAYMENT_GATEWAY_STATUS','DRAFT','es','Borrador'),                ('PAYMENT_GATEWAY_STATUS','DRAFT','en','Draft'),
  ('PAYMENT_GATEWAY_STATUS','ACTIVE','es','Activa'),                 ('PAYMENT_GATEWAY_STATUS','ACTIVE','en','Active'),
  ('PAYMENT_GATEWAY_STATUS','INACTIVE','es','Inactiva'),             ('PAYMENT_GATEWAY_STATUS','INACTIVE','en','Inactive'),
  ('PAYMENT_GATEWAY_STATUS','MAINTENANCE','es','En mantenimiento'),  ('PAYMENT_GATEWAY_STATUS','MAINTENANCE','en','Maintenance'),
  ('PAYMENT_GATEWAY_STATUS','DEPRECATED','es','Obsoleta'),           ('PAYMENT_GATEWAY_STATUS','DEPRECATED','en','Deprecated'),

  -- ================ GATEWAY_ELIGIBILITY_STATUS ===================
  ('GATEWAY_ELIGIBILITY_STATUS','NOT_STARTED','es','No iniciado'),   ('GATEWAY_ELIGIBILITY_STATUS','NOT_STARTED','en','Not started'),
  ('GATEWAY_ELIGIBILITY_STATUS','IN_PROGRESS','es','En progreso'),   ('GATEWAY_ELIGIBILITY_STATUS','IN_PROGRESS','en','In progress'),
  ('GATEWAY_ELIGIBILITY_STATUS','APPROVED','es','Aprobado'),          ('GATEWAY_ELIGIBILITY_STATUS','APPROVED','en','Approved'),
  ('GATEWAY_ELIGIBILITY_STATUS','REJECTED','es','Rechazado'),         ('GATEWAY_ELIGIBILITY_STATUS','REJECTED','en','Rejected'),
  ('GATEWAY_ELIGIBILITY_STATUS','EXPIRED','es','Expirado'),           ('GATEWAY_ELIGIBILITY_STATUS','EXPIRED','en','Expired'),
  ('GATEWAY_ELIGIBILITY_STATUS','BLOCKED','es','Bloqueado'),          ('GATEWAY_ELIGIBILITY_STATUS','BLOCKED','en','Blocked'),

  -- ================== MERCHANT_GATEWAY_STATUS ====================
  ('MERCHANT_GATEWAY_STATUS','NOT_CONFIGURED','es','No configurada'), ('MERCHANT_GATEWAY_STATUS','NOT_CONFIGURED','en','Not configured'),
  ('MERCHANT_GATEWAY_STATUS','ONBOARDING','es','En onboarding'),      ('MERCHANT_GATEWAY_STATUS','ONBOARDING','en','Onboarding'),
  ('MERCHANT_GATEWAY_STATUS','ACTIVE','es','Activa'),                 ('MERCHANT_GATEWAY_STATUS','ACTIVE','en','Active'),
  ('MERCHANT_GATEWAY_STATUS','SUSPENDED','es','Suspendida'),          ('MERCHANT_GATEWAY_STATUS','SUSPENDED','en','Suspended'),
  ('MERCHANT_GATEWAY_STATUS','ERROR','es','Con errores'),             ('MERCHANT_GATEWAY_STATUS','ERROR','en','Error'),

  -- ======================== ORDER_STATUS =========================
  ('ORDER_STATUS','DRAFT','es','Borrador'),         ('ORDER_STATUS','DRAFT','en','Draft'),
  ('ORDER_STATUS','PLACED','es','Realizada'),       ('ORDER_STATUS','PLACED','en','Placed'),
  ('ORDER_STATUS','CONFIRMED','es','Confirmada'),   ('ORDER_STATUS','CONFIRMED','en','Confirmed'),
  ('ORDER_STATUS','IN_PROGRESS','es','En proceso'), ('ORDER_STATUS','IN_PROGRESS','en','In progress'),
  ('ORDER_STATUS','FULFILLED','es','Cumplida'),     ('ORDER_STATUS','FULFILLED','en','Fulfilled'),
  ('ORDER_STATUS','DELIVERED','es','Entregada'),    ('ORDER_STATUS','DELIVERED','en','Delivered'),
  ('ORDER_STATUS','CANCELLED','es','Cancelada'),    ('ORDER_STATUS','CANCELLED','en','Cancelled'),
  ('ORDER_STATUS','REFUNDED','es','Reembolsada'),   ('ORDER_STATUS','REFUNDED','en','Refunded'),
  ('ORDER_STATUS','RETURNED','es','Devuelta'),      ('ORDER_STATUS','RETURNED','en','Returned'),

  -- ======================= INVOICE_STATUS ========================
  ('INVOICE_STATUS','DRAFT','es','Borrador'),                ('INVOICE_STATUS','DRAFT','en','Draft'),
  ('INVOICE_STATUS','ISSUED','es','Emitida'),                ('INVOICE_STATUS','ISSUED','en','Issued'),
  ('INVOICE_STATUS','PARTIALLY_PAID','es','Parcialmente pagada'), ('INVOICE_STATUS','PARTIALLY_PAID','en','Partially paid'),
  ('INVOICE_STATUS','PAID','es','Pagada'),                   ('INVOICE_STATUS','PAID','en','Paid'),
  ('INVOICE_STATUS','OVERDUE','es','Vencida'),               ('INVOICE_STATUS','OVERDUE','en','Overdue'),
  ('INVOICE_STATUS','CANCELLED','es','Cancelada'),           ('INVOICE_STATUS','CANCELLED','en','Cancelled'),
  ('INVOICE_STATUS','VOID','es','Anulada'),                  ('INVOICE_STATUS','VOID','en','Void'),
  ('INVOICE_STATUS','REFUNDED','es','Reembolsada'),          ('INVOICE_STATUS','REFUNDED','en','Refunded'),

  -- ======================= PRODUCT_STATUS ========================
  ('PRODUCT_STATUS','DRAFT','es','Borrador'),                ('PRODUCT_STATUS','DRAFT','en','Draft'),
  ('PRODUCT_STATUS','ACTIVE','es','Activo'),                 ('PRODUCT_STATUS','ACTIVE','en','Active'),
  ('PRODUCT_STATUS','OUT_OF_STOCK','es','Sin stock'),        ('PRODUCT_STATUS','OUT_OF_STOCK','en','Out of stock'),
  ('PRODUCT_STATUS','ARCHIVED','es','Archivado'),            ('PRODUCT_STATUS','ARCHIVED','en','Archived'),
  ('PRODUCT_STATUS','DISCONTINUED','es','Descontinuado'),    ('PRODUCT_STATUS','DISCONTINUED','en','Discontinued'),

  -- ======================== LOYALTY_TIER =========================
  ('LOYALTY_TIER','BRONZE','es','Bronce'),     ('LOYALTY_TIER','BRONZE','en','Bronze'),
  ('LOYALTY_TIER','SILVER','es','Plata'),      ('LOYALTY_TIER','SILVER','en','Silver'),
  ('LOYALTY_TIER','GOLD','es','Oro'),          ('LOYALTY_TIER','GOLD','en','Gold'),
  ('LOYALTY_TIER','PLATINUM','es','Platino'),  ('LOYALTY_TIER','PLATINUM','en','Platinum'),
  ('LOYALTY_TIER','DIAMOND','es','Diamante'),  ('LOYALTY_TIER','DIAMOND','en','Diamond'),

  -- ==================== PAYOUT_REQUEST_STATUS ====================
  ('PAYOUT_REQUEST_STATUS','REQUESTED','es','Solicitado'), ('PAYOUT_REQUEST_STATUS','REQUESTED','en','Requested'),
  ('PAYOUT_REQUEST_STATUS','APPROVED','es','Aprobado'),    ('PAYOUT_REQUEST_STATUS','APPROVED','en','Approved'),
  ('PAYOUT_REQUEST_STATUS','REJECTED','es','Rechazado'),   ('PAYOUT_REQUEST_STATUS','REJECTED','en','Rejected'),
  ('PAYOUT_REQUEST_STATUS','SETTLED','es','Liquidado'),    ('PAYOUT_REQUEST_STATUS','SETTLED','en','Settled'),

  -- ==================== WALLET_MOVEMENT_TYPE =====================
  ('WALLET_MOVEMENT_TYPE','CASHBACK_EARNED','es','Cashback acreditado'),                 ('WALLET_MOVEMENT_TYPE','CASHBACK_EARNED','en','Cashback earned'),
  ('WALLET_MOVEMENT_TYPE','REFERRAL_COMMISSION_EARNED','es','Comisión por referido acreditada'), ('WALLET_MOVEMENT_TYPE','REFERRAL_COMMISSION_EARNED','en','Referral commission earned'),
  ('WALLET_MOVEMENT_TYPE','PAYOUT_REQUESTED','es','Retiro solicitado'),                  ('WALLET_MOVEMENT_TYPE','PAYOUT_REQUESTED','en','Payout requested'),
  ('WALLET_MOVEMENT_TYPE','PAYOUT_REVERSED','es','Retiro revertido'),                    ('WALLET_MOVEMENT_TYPE','PAYOUT_REVERSED','en','Payout reversed'),
  ('WALLET_MOVEMENT_TYPE','PAYOUT_SETTLED','es','Retiro liquidado'),                     ('WALLET_MOVEMENT_TYPE','PAYOUT_SETTLED','en','Payout settled'),

  -- ===================== BUSINESS_DOC_TYPE =======================
  ('BUSINESS_DOC_TYPE','INVOICE','es','Factura'),                  ('BUSINESS_DOC_TYPE','INVOICE','en','Invoice'),
  ('BUSINESS_DOC_TYPE','CREDIT_NOTE','es','Nota de crédito'),      ('BUSINESS_DOC_TYPE','CREDIT_NOTE','en','Credit note'),
  ('BUSINESS_DOC_TYPE','DEBIT_NOTE','es','Nota de débito'),        ('BUSINESS_DOC_TYPE','DEBIT_NOTE','en','Debit note'),
  ('BUSINESS_DOC_TYPE','RECEIPT','es','Recibo'),                   ('BUSINESS_DOC_TYPE','RECEIPT','en','Receipt'),
  ('BUSINESS_DOC_TYPE','CONTRACT','es','Contrato'),                ('BUSINESS_DOC_TYPE','CONTRACT','en','Contract'),
  ('BUSINESS_DOC_TYPE','NDA','es','Acuerdo de confidencialidad'),  ('BUSINESS_DOC_TYPE','NDA','en','NDA'),
  ('BUSINESS_DOC_TYPE','PURCHASE_ORDER','es','Orden de compra'),   ('BUSINESS_DOC_TYPE','PURCHASE_ORDER','en','Purchase order'),
  ('BUSINESS_DOC_TYPE','QUOTE','es','Cotización'),                 ('BUSINESS_DOC_TYPE','QUOTE','en','Quote')
) AS t(category_code, item_code, locale, label)
  ON ci."categoryCode" = t.category_code AND ci."itemCode" = t.item_code AND ci."type" = 'catalogitem'
ON CONFLICT ON CONSTRAINT "uq_catalog_translation_item_locale" DO UPDATE SET
  "modificationDate" = NOW(),
  "label"            = EXCLUDED."label";
