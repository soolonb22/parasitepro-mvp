CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  image_credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  sample_type VARCHAR(50),
  collection_date DATE,
  location VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  processing_started_at TIMESTAMP,
  processing_completed_at TIMESTAMP
);

CREATE TABLE detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  parasite_id VARCHAR(100) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  confidence_score DECIMAL(5,4),
  parasite_type VARCHAR(50),
  urgency_level VARCHAR(50),
  life_stage VARCHAR(50),
  bounding_box_x INTEGER,
  bounding_box_y INTEGER,
  bounding_box_width INTEGER,
  bounding_box_height INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  credits_purchased INTEGER NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON analyses(user_id);
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_detections_analysis ON detections(analysis_id);
CREATE INDEX idx_payments_user ON payments(user_id);
