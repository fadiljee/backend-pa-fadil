CREATE TABLE IF NOT EXISTS "landing_settings" (
  "id" integer PRIMARY KEY DEFAULT 1 CHECK ("id" = 1),
  "data" jsonb NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
