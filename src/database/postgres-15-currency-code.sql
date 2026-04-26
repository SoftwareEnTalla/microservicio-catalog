-- ====================================================================
-- currency_code_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "currency_code_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('USD', 'Usd', '', '{}'::jsonb, 'system', TRUE, 'currencycode'),
  ('EUR', 'Eur', '', '{}'::jsonb, 'system', TRUE, 'currencycode'),
  ('MXN', 'Mxn', '', '{}'::jsonb, 'system', TRUE, 'currencycode'),
  ('DOP', 'Dop', '', '{}'::jsonb, 'system', TRUE, 'currencycode'),
  ('COP', 'Cop', '', '{}'::jsonb, 'system', TRUE, 'currencycode')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
