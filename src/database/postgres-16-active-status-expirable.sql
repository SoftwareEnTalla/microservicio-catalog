-- ====================================================================
-- active_status_expirable_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "active_status_expirable_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'activestatusexpirable'),
  ('INACTIVE', 'Inactive', '', '{}'::jsonb, 'system', TRUE, 'activestatusexpirable'),
  ('EXPIRED', 'Expired', '', '{}'::jsonb, 'system', TRUE, 'activestatusexpirable')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
