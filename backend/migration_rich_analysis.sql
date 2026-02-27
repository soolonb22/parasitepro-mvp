-- Migration: Add rich AI analysis fields to analyses table
-- Run this in Railway PostgreSQL console

-- Add rich analysis columns to analyses table
ALTER TABLE analyses
  ADD COLUMN IF NOT EXISTS overall_assessment TEXT,
  ADD COLUMN IF NOT EXISTS visual_findings TEXT,
  ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(50) DEFAULT 'moderate'
    CHECK (urgency_level IN ('low', 'moderate', 'high', 'emergency')),
  ADD COLUMN IF NOT EXISTS differential_diagnoses JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS recommended_actions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS health_risks JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS treatment_options JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gp_testing_list JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gp_script JSONB DEFAULT '[]'::jsonb;

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'analyses'
ORDER BY ordinal_position;
