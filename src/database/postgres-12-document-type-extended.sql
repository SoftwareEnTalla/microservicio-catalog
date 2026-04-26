-- ====================================================================
-- document_type_extended_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "document_type_extended_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('NATIONAL_ID', 'National Id', '', '{}'::jsonb, 'system', TRUE, 'documenttypeextended'),
  ('PASSPORT', 'Passport', '', '{}'::jsonb, 'system', TRUE, 'documenttypeextended'),
  ('FOREIGN_ID', 'Foreign Id', '', '{}'::jsonb, 'system', TRUE, 'documenttypeextended'),
  ('TAX_ID', 'Tax Id', '', '{}'::jsonb, 'system', TRUE, 'documenttypeextended'),
  ('OTHER', 'Other', '', '{}'::jsonb, 'system', TRUE, 'documenttypeextended')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
