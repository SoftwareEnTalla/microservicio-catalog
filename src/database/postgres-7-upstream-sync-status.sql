-- ====================================================================
-- upstream_sync_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "upstream_sync_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('LOCAL_ONLY', 'Local Only', '', '{}'::jsonb, 'system', TRUE, 'upstreamsyncstatus'),
  ('SYNCED', 'Synced', '', '{}'::jsonb, 'system', TRUE, 'upstreamsyncstatus'),
  ('PENDING_UPSTREAM', 'Pending Upstream', '', '{}'::jsonb, 'system', TRUE, 'upstreamsyncstatus'),
  ('DIVERGED', 'Diverged', '', '{}'::jsonb, 'system', TRUE, 'upstreamsyncstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
