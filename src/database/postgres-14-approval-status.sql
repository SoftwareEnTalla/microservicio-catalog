-- ====================================================================
-- approval_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "approval_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('DRAFT', 'Draft', '', '{}'::jsonb, 'system', TRUE, 'approvalstatus'),
  ('PENDING', 'Pending', '', '{}'::jsonb, 'system', TRUE, 'approvalstatus'),
  ('APPROVED', 'Approved', '', '{}'::jsonb, 'system', TRUE, 'approvalstatus'),
  ('REJECTED', 'Rejected', '', '{}'::jsonb, 'system', TRUE, 'approvalstatus'),
  ('SUSPENDED', 'Suspended', '', '{}'::jsonb, 'system', TRUE, 'approvalstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
