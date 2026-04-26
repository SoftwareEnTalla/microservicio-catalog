-- ====================================================================
-- customer_onboarding_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "customer_onboarding_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "active", "type")
VALUES
  ('NOT_STARTED', 'Not Started', '', '{}'::jsonb, 'system', TRUE, 'customeronboardingstatus'),
  ('IN_PROGRESS', 'In Progress', '', '{}'::jsonb, 'system', TRUE, 'customeronboardingstatus'),
  ('APPROVED', 'Approved', '', '{}'::jsonb, 'system', TRUE, 'customeronboardingstatus'),
  ('REJECTED', 'Rejected', '', '{}'::jsonb, 'system', TRUE, 'customeronboardingstatus'),
  ('EXPIRED', 'Expired', '', '{}'::jsonb, 'system', TRUE, 'customeronboardingstatus'),
  ('BLOCKED', 'Blocked', '', '{}'::jsonb, 'system', TRUE, 'customeronboardingstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "active"           = TRUE,
  "modificationDate" = NOW();
