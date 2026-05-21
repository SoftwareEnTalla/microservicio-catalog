-- =====================================================================
-- Catalog Service · Seed 2/3 · Ítems de los nomencladores
-- =====================================================================
-- Idempotente: ON CONFLICT ("categoryCode","itemCode") DO UPDATE.
-- Tabla destino: catalog_item_base_entity (STI; type='catalogitem').
-- categoryId se resuelve por sub-SELECT contra catalog_category_base_entity.
-- =====================================================================

-- Helper: macro implícita — cada bloque sigue el mismo patrón.

-- ---------------------------------------------------------------------
-- CURRENCY (ISO-4217) — sólo las que efectivamente aparecen en el ecosistema + top mundial.
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description",
   "categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code, v.label,
       cc."id",'CURRENCY',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,
       jsonb_build_object('symbol',v.symbol,'numeric',v.numeric_code)::json
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('USD','US Dollar','$','840',1,true),
  ('EUR','Euro','€','978',2,false),
  ('GBP','Pound Sterling','£','826',3,false),
  ('MXN','Mexican Peso','$','484',4,false),
  ('DOP','Dominican Peso','RD$','214',5,false),
  ('COP','Colombian Peso','$','170',6,false),
  ('CUP','Cuban Peso','$','192',7,false),
  ('BRL','Brazilian Real','R$','986',8,false),
  ('ARS','Argentine Peso','$','032',9,false),
  ('CLP','Chilean Peso','$','152',10,false),
  ('PEN','Peruvian Sol','S/','604',11,false),
  ('CAD','Canadian Dollar','$','124',12,false),
  ('JPY','Japanese Yen','¥','392',13,false),
  ('CNY','Yuan Renminbi','¥','156',14,false),
  ('CHF','Swiss Franc','CHF','756',15,false)
) AS v(code,label,symbol,numeric_code,ord,is_default)
WHERE cc."categoryCode" = 'CURRENCY' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate" = NOW(),
  "label"     = EXCLUDED."label",
  "sortOrder" = EXCLUDED."sortOrder",
  "isDefault" = EXCLUDED."isDefault",
  "status"    = EXCLUDED."status",
  "metadata"  = EXCLUDED."metadata",
  "version"   = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- COUNTRY (ISO-3166-1 alpha-2)
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description",
   "categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code, v.label,
       cc."id",'COUNTRY',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,
       jsonb_build_object('alpha3',v.alpha3,'numeric',v.numeric_code,'callingCode',v.calling)::json
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('CU','Cuba','CUB','192','+53',1,true),
  ('US','United States','USA','840','+1',2,false),
  ('MX','Mexico','MEX','484','+52',3,false),
  ('ES','Spain','ESP','724','+34',4,false),
  ('CO','Colombia','COL','170','+57',5,false),
  ('DO','Dominican Republic','DOM','214','+1',6,false),
  ('PE','Peru','PER','604','+51',7,false),
  ('AR','Argentina','ARG','032','+54',8,false),
  ('CL','Chile','CHL','152','+56',9,false),
  ('BR','Brazil','BRA','076','+55',10,false),
  ('EC','Ecuador','ECU','218','+593',11,false),
  ('VE','Venezuela','VEN','862','+58',12,false),
  ('CA','Canada','CAN','124','+1',13,false),
  ('GB','United Kingdom','GBR','826','+44',14,false),
  ('FR','France','FRA','250','+33',15,false),
  ('DE','Germany','DEU','276','+49',16,false),
  ('IT','Italy','ITA','380','+39',17,false),
  ('PT','Portugal','PRT','620','+351',18,false)
) AS v(code,label,alpha3,numeric_code,calling,ord,is_default)
WHERE cc."categoryCode" = 'COUNTRY' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate" = NOW(),
  "label"     = EXCLUDED."label",
  "sortOrder" = EXCLUDED."sortOrder",
  "isDefault" = EXCLUDED."isDefault",
  "status"    = EXCLUDED."status",
  "metadata"  = EXCLUDED."metadata",
  "version"   = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- LOCALE (BCP-47)
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description",
   "categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code, v.label,
       cc."id",'LOCALE',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('es','Español',1,true),
  ('en','English',2,false),
  ('pt','Português',3,false),
  ('fr','Français',4,false),
  ('es-MX','Español (México)',5,false),
  ('es-ES','Español (España)',6,false),
  ('es-CU','Español (Cuba)',7,false),
  ('en-US','English (United States)',8,false),
  ('en-GB','English (United Kingdom)',9,false),
  ('pt-BR','Português (Brasil)',10,false),
  ('pt-PT','Português (Portugal)',11,false),
  ('fr-FR','Français (France)',12,false),
  ('it','Italiano',13,false),
  ('de','Deutsch',14,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'LOCALE' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate" = NOW(),
  "label"     = EXCLUDED."label",
  "sortOrder" = EXCLUDED."sortOrder",
  "isDefault" = EXCLUDED."isDefault",
  "status"    = EXCLUDED."status",
  "version"   = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- GENDER
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'GENDER',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('MALE','Male',1,false),
  ('FEMALE','Female',2,false),
  ('OTHER','Other',3,false),
  ('NOT_DECLARED','Not declared',4,true)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'GENDER' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- DOCUMENT_TYPE
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'DOCUMENT_TYPE',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('NATIONAL_ID','National ID',1,true),
  ('PASSPORT','Passport',2,false),
  ('FOREIGN_ID','Foreign ID',3,false),
  ('TAX_ID','Tax ID',4,false),
  ('DRIVER_LICENSE','Driver license',5,false),
  ('OTHER','Other',6,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'DOCUMENT_TYPE' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- APPROVAL_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'APPROVAL_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('DRAFT','Draft',1,true),
  ('PENDING','Pending',2,false),
  ('APPROVED','Approved',3,false),
  ('REJECTED','Rejected',4,false),
  ('SUSPENDED','Suspended',5,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'APPROVAL_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- GENERIC_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'GENERIC_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('ACTIVE','Active',1,true),
  ('INACTIVE','Inactive',2,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'GENERIC_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- CONTRACT_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'CONTRACT_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('DRAFT','Draft',1,true),
  ('ACTIVE','Active',2,false),
  ('SUSPENDED','Suspended',3,false),
  ('TERMINATED','Terminated',4,false),
  ('EXPIRED','Expired',5,false),
  ('PENDING','Pending',6,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'CONTRACT_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- PAYMENT_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'PAYMENT_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('CREATED','Created',1,true),
  ('PENDING','Pending',2,false),
  ('REQUIRES_CUSTOMER_ACTION','Requires customer action',3,false),
  ('AUTHORIZED','Authorized',4,false),
  ('SUCCEEDED','Succeeded',5,false),
  ('FAILED','Failed',6,false),
  ('CANCELLED','Cancelled',7,false),
  ('EXPIRED','Expired',8,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'PAYMENT_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- PAYMENT_GATEWAY_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'PAYMENT_GATEWAY_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('DRAFT','Draft',1,true),
  ('ACTIVE','Active',2,false),
  ('INACTIVE','Inactive',3,false),
  ('MAINTENANCE','Maintenance',4,false),
  ('DEPRECATED','Deprecated',5,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'PAYMENT_GATEWAY_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- GATEWAY_ELIGIBILITY_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'GATEWAY_ELIGIBILITY_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('NOT_STARTED','Not started',1,true),
  ('IN_PROGRESS','In progress',2,false),
  ('APPROVED','Approved',3,false),
  ('REJECTED','Rejected',4,false),
  ('EXPIRED','Expired',5,false),
  ('BLOCKED','Blocked',6,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'GATEWAY_ELIGIBILITY_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- MERCHANT_GATEWAY_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'MERCHANT_GATEWAY_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('NOT_CONFIGURED','Not configured',1,true),
  ('ONBOARDING','Onboarding',2,false),
  ('ACTIVE','Active',3,false),
  ('SUSPENDED','Suspended',4,false),
  ('ERROR','Error',5,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'MERCHANT_GATEWAY_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- ORDER_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'ORDER_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('DRAFT','Draft',1,true),
  ('PLACED','Placed',2,false),
  ('CONFIRMED','Confirmed',3,false),
  ('IN_PROGRESS','In progress',4,false),
  ('FULFILLED','Fulfilled',5,false),
  ('DELIVERED','Delivered',6,false),
  ('CANCELLED','Cancelled',7,false),
  ('REFUNDED','Refunded',8,false),
  ('RETURNED','Returned',9,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'ORDER_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- INVOICE_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'INVOICE_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('DRAFT','Draft',1,true),
  ('ISSUED','Issued',2,false),
  ('PARTIALLY_PAID','Partially paid',3,false),
  ('PAID','Paid',4,false),
  ('OVERDUE','Overdue',5,false),
  ('CANCELLED','Cancelled',6,false),
  ('VOID','Void',7,false),
  ('REFUNDED','Refunded',8,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'INVOICE_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- PRODUCT_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'PRODUCT_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('DRAFT','Draft',1,true),
  ('ACTIVE','Active',2,false),
  ('OUT_OF_STOCK','Out of stock',3,false),
  ('ARCHIVED','Archived',4,false),
  ('DISCONTINUED','Discontinued',5,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'PRODUCT_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- LOYALTY_TIER
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'LOYALTY_TIER',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,
       jsonb_build_object('minPoints',v.min_points)::json
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('BRONZE','Bronze',0,1,true),
  ('SILVER','Silver',1000,2,false),
  ('GOLD','Gold',5000,3,false),
  ('PLATINUM','Platinum',15000,4,false),
  ('DIAMOND','Diamond',50000,5,false)
) AS v(code,label,min_points,ord,is_default)
WHERE cc."categoryCode" = 'LOYALTY_TIER' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status","metadata"=EXCLUDED."metadata",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- PAYOUT_REQUEST_STATUS
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'PAYOUT_REQUEST_STATUS',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('REQUESTED','Requested',1,true),
  ('APPROVED','Approved',2,false),
  ('REJECTED','Rejected',3,false),
  ('SETTLED','Settled',4,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'PAYOUT_REQUEST_STATUS' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- WALLET_MOVEMENT_TYPE
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'WALLET_MOVEMENT_TYPE',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,
       jsonb_build_object('financialImpact', v.financial_impact, 'channel', v.channel)::json
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('CASHBACK_EARNED','Cashback earned',1,true,'credit','loyalty'),
  ('REFERRAL_COMMISSION_EARNED','Referral commission earned',2,false,'credit','referral'),
  ('PAYOUT_REQUESTED','Payout requested',3,false,'debit','payout'),
  ('PAYOUT_REVERSED','Payout reversed',4,false,'credit','payout'),
  ('PAYOUT_SETTLED','Payout settled',5,false,'debit','payout')
) AS v(code,label,ord,is_default,financial_impact,channel)
WHERE cc."categoryCode" = 'WALLET_MOVEMENT_TYPE' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status","metadata"=EXCLUDED."metadata",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- BUSINESS_DOC_TYPE
-- ---------------------------------------------------------------------
INSERT INTO "catalog_item_base_entity"
  ("id","type","creationDate","modificationDate","createdBy","isActive",
   "name","description","categoryId","categoryCode","itemCode","label","sortOrder","isDefault","status","version","metadata")
SELECT uuid_generate_v4(),'catalogitem',NOW(),NOW(),'system',true,
       v.code,v.label,cc."id",'BUSINESS_DOC_TYPE',v.code,v.label,v.ord,v.is_default,'ACTIVE',1,NULL
FROM "catalog_category_base_entity" cc
CROSS JOIN (VALUES
  ('INVOICE','Invoice',1,true),
  ('CREDIT_NOTE','Credit note',2,false),
  ('DEBIT_NOTE','Debit note',3,false),
  ('RECEIPT','Receipt',4,false),
  ('CONTRACT','Contract',5,false),
  ('NDA','NDA',6,false),
  ('PURCHASE_ORDER','Purchase order',7,false),
  ('QUOTE','Quote',8,false)
) AS v(code,label,ord,is_default)
WHERE cc."categoryCode" = 'BUSINESS_DOC_TYPE' AND cc."type" = 'catalogcategory'
ON CONFLICT ON CONSTRAINT "uq_catalog_item_code" DO UPDATE SET
  "modificationDate"=NOW(),"label"=EXCLUDED."label","sortOrder"=EXCLUDED."sortOrder",
  "isDefault"=EXCLUDED."isDefault","status"=EXCLUDED."status",
  "version" = "catalog_item_base_entity"."version" + 1;

-- ---------------------------------------------------------------------
-- Recálculo de itemsCount por categoría
-- ---------------------------------------------------------------------
UPDATE "catalog_category_base_entity" cc
SET "itemsCount" = sub.cnt,
    "modificationDate" = NOW()
FROM (
  SELECT "categoryCode" AS code, COUNT(*)::int AS cnt
  FROM "catalog_item_base_entity"
  WHERE "type" = 'catalogitem' AND "status" = 'ACTIVE'
  GROUP BY "categoryCode"
) sub
WHERE cc."categoryCode" = sub.code AND cc."type" = 'catalogcategory';
