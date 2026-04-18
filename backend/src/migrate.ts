import pool from './config/database';

export async function runMigrations(): Promise<void> {
  console.log('🔄 Running database migrations...');
  
  const schema = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      image_credits INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      last_login_at TIMESTAMP,
      CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
    );

    CREATE TABLE IF NOT EXISTS analyses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      thumbnail_url TEXT,
      status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
      sample_type VARCHAR(50),
      collection_date DATE,
      location VARCHAR(255),
      uploaded_at TIMESTAMP DEFAULT NOW(),
      processing_started_at TIMESTAMP,
      processing_completed_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS detections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
      parasite_id VARCHAR(100) NOT NULL,
      common_name VARCHAR(255) NOT NULL,
      scientific_name VARCHAR(255),
      confidence_score DECIMAL(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
      parasite_type VARCHAR(50) CHECK (parasite_type IN ('protozoa', 'helminth', 'ectoparasite')),
      urgency_level VARCHAR(50) CHECK (urgency_level IN ('low', 'moderate', 'high', 'emergency')),
      life_stage VARCHAR(50),
      bounding_box_x INTEGER,
      bounding_box_y INTEGER,
      bounding_box_width INTEGER,
      bounding_box_height INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
      amount INTEGER NOT NULL,
      currency VARCHAR(3) DEFAULT 'USD',
      credits_purchased INTEGER NOT NULL,
      status VARCHAR(50) CHECK (status IN ('pending', 'succeeded', 'failed')),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_analyses_user ON analyses(user_id);
    CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
    CREATE INDEX IF NOT EXISTS idx_detections_analysis ON detections(analysis_id);
    CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_analyses_uploaded_at ON analyses(uploaded_at DESC);
  `;

  try {
    await pool.query(schema);

    // Incremental migrations — safe to run multiple times
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_prt_token_hash ON password_reset_tokens(token_hash);
      CREATE INDEX IF NOT EXISTS idx_prt_user_id ON password_reset_tokens(user_id);

      -- Add missing bounding_box columns to detections (safe if already exist)
      -- Rich analysis columns
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS ai_summary TEXT;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS overall_assessment TEXT;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS visual_findings TEXT;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(20);
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS image_quality VARCHAR(20);
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS differential_diagnoses JSONB;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS recommended_actions JSONB;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS health_risks JSONB;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS treatment_options JSONB;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS gp_testing_list JSONB;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS gp_script_if_dismissed JSONB;
      ALTER TABLE analyses ADD COLUMN IF NOT EXISTS natural_remedies JSONB;
      -- Fix sample_type constraint to allow all types
      ALTER TABLE analyses DROP CONSTRAINT IF EXISTS analyses_sample_type_check;
      -- Removed sample_type constraint to allow any value
      -- Add bounding_box columns to detections
      ALTER TABLE detections ADD COLUMN IF NOT EXISTS bounding_box_x INTEGER;
      ALTER TABLE detections ADD COLUMN IF NOT EXISTS bounding_box_y INTEGER;
      ALTER TABLE detections ADD COLUMN IF NOT EXISTS bounding_box_width INTEGER;
      ALTER TABLE detections ADD COLUMN IF NOT EXISTS bounding_box_height INTEGER;

      -- One-time: grant 20 test credits to admin account
      UPDATE users SET image_credits = 20
      WHERE email = 'importantalerts26@gmail.com' AND image_credits = 0;

      -- Referral system
      ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(8) UNIQUE;

      CREATE TABLE IF NOT EXISTS referrals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'converted')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        converted_at TIMESTAMPTZ,
        UNIQUE(referred_id)
      );
      CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
      CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);

      -- Subscription support
      ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due'));
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shared_analyses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
        token VARCHAR(64) NOT NULL UNIQUE,
        view_count INTEGER DEFAULT 0,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_shared_analyses_token ON shared_analyses(token);
      CREATE INDEX IF NOT EXISTS idx_shared_analyses_analysis ON shared_analyses(analysis_id);
    `);

    console.log('✅ Database migrations complete');
  } catch (err: any) {
    console.error('⚠️  Migration error (non-fatal):', err.message);
  }
}
