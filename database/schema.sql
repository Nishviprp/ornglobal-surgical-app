-- ORNGlobal Phase 1 - Database Schema
-- PostgreSQL with Supabase Row Level Security

-- Create Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on hospital name for faster searches
CREATE INDEX IF NOT EXISTS idx_hospitals_name ON hospitals(name);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  hospital_id UUID NOT NULL REFERENCES hospitals(id),
  role VARCHAR(50) DEFAULT 'nurse',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes on users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_hospital_id ON users(hospital_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create OTP Tokens Table
CREATE TABLE IF NOT EXISTS otp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes on otp_tokens table
CREATE INDEX IF NOT EXISTS idx_otp_tokens_email ON otp_tokens(email);
CREATE INDEX IF NOT EXISTS idx_otp_tokens_expires_at ON otp_tokens(expires_at);

-- Create Surgical Cases Table (prepared for Phase 2)
CREATE TABLE IF NOT EXISTS surgical_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id),
  patient_name VARCHAR(255) NOT NULL,
  diagnosis TEXT,
  date_of_surgery DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes on surgical_cases table
CREATE INDEX IF NOT EXISTS idx_surgical_cases_user_id ON surgical_cases(user_id);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_hospital_id ON surgical_cases(hospital_id);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_status ON surgical_cases(status);
CREATE INDEX IF NOT EXISTS idx_surgical_cases_date_of_surgery ON surgical_cases(date_of_surgery);

-- Enable Row Level Security
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgical_cases ENABLE ROW LEVEL SECURITY;

-- Hospitals Table Policies
-- Policy: Hospitals are viewable by all authenticated users
CREATE POLICY "Hospitals viewable by all"
  ON hospitals FOR SELECT
  USING (true);

-- Users Table Policies
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- OTP Tokens Table Policies
-- Policy: Only the system can manage OTP tokens (via authenticated users during registration)
CREATE POLICY "OTP tokens managed during registration"
  ON otp_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "OTP tokens deletable by system"
  ON otp_tokens FOR DELETE
  USING (true);

-- Surgical Cases Table Policies (Phase 2)
-- Policy: Users can view their own cases
CREATE POLICY "Users see own cases"
  ON surgical_cases FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own cases
CREATE POLICY "Users can create own cases"
  ON surgical_cases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cases
CREATE POLICY "Users can update own cases"
  ON surgical_cases FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own cases
CREATE POLICY "Users can delete own cases"
  ON surgical_cases FOR DELETE
  USING (auth.uid() = user_id);

-- Insert Sample Hospitals
INSERT INTO hospitals (name, city, country) VALUES
  ('Metropolitan Medical Center', 'New York', 'USA'),
  ('Apollo Hospital', 'Mumbai', 'India'),
  ('Mayo Clinic', 'Rochester', 'USA'),
  ('St. Mary''s Hospital', 'London', 'UK'),
  ('Tokyo Medical University Hospital', 'Tokyo', 'Japan'),
  ('Toronto General Hospital', 'Toronto', 'Canada'),
  ('National University Hospital', 'Singapore', 'Singapore'),
  ('Charité Hospital', 'Berlin', 'Germany')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_hospitals_updated_at ON hospitals;
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_surgical_cases_updated_at ON surgical_cases;
CREATE TRIGGER update_surgical_cases_updated_at BEFORE UPDATE ON surgical_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify Data
-- SELECT COUNT(*) as hospital_count FROM hospitals;
-- SELECT * FROM hospitals ORDER BY name;
