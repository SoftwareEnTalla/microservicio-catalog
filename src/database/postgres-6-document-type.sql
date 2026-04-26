-- ====================================================================
-- document_type_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "document_type_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('NATIONAL_ID', 'National Id', '', '{}'::jsonb, 'system', TRUE, 'documenttype'),
  ('PASSPORT', 'Passport', '', '{}'::jsonb, 'system', TRUE, 'documenttype'),
  ('DRIVER_LICENSE', 'Driver License', '', '{}'::jsonb, 'system', TRUE, 'documenttype'),
  ('OTHER', 'Other', '', '{}'::jsonb, 'system', TRUE, 'documenttype')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
