-- ====================================================================
-- risk_level_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "risk_level_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('LOW', 'Low', '', '{}'::jsonb, 'system', TRUE, 'risklevel'),
  ('MEDIUM', 'Medium', '', '{}'::jsonb, 'system', TRUE, 'risklevel'),
  ('HIGH', 'High', '', '{}'::jsonb, 'system', TRUE, 'risklevel')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
