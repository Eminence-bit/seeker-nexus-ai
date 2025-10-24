-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin');

-- Create enum for job types
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship');

-- Create enum for experience levels
CREATE TYPE experience_level AS ENUM ('entry', 'mid', 'senior', 'lead', 'executive');

-- Create enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'interview', 'offered', 'rejected', 'accepted');

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'job_seeker',
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create job_seeker_profiles table
CREATE TABLE job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  desired_salary_min INTEGER,
  desired_salary_max INTEGER,
  job_preferences TEXT[],
  bio TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create employer_profiles table
CREATE TABLE employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  company_website TEXT,
  company_size TEXT,
  industry TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type job_type NOT NULL,
  experience_level experience_level NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  skills_required TEXT[],
  benefits TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  views_count INTEGER NOT NULL DEFAULT 0,
  applications_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES job_seeker_profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  resume_url TEXT,
  ai_match_score INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, job_seeker_id)
);

-- Create saved_jobs table
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES job_seeker_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id, job_seeker_id)
);

-- Create chat_conversations table
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for job_seeker_profiles
CREATE POLICY "Anyone can view job seeker profiles" ON job_seeker_profiles FOR SELECT USING (true);
CREATE POLICY "Job seekers can update own profile" ON job_seeker_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Job seekers can insert own profile" ON job_seeker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for employer_profiles
CREATE POLICY "Anyone can view employer profiles" ON employer_profiles FOR SELECT USING (true);
CREATE POLICY "Employers can update own profile" ON employer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Employers can insert own profile" ON employer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (is_active = true OR employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Employers can insert jobs" ON jobs FOR INSERT WITH CHECK (employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Employers can update own jobs" ON jobs FOR UPDATE USING (employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Employers can delete own jobs" ON jobs FOR DELETE USING (employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid()));

-- RLS Policies for applications
CREATE POLICY "Job seekers can view own applications" ON applications FOR SELECT USING (job_seeker_id IN (SELECT id FROM job_seeker_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Employers can view applications for their jobs" ON applications FOR SELECT USING (job_id IN (SELECT id FROM jobs WHERE employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())));
CREATE POLICY "Job seekers can create applications" ON applications FOR INSERT WITH CHECK (job_seeker_id IN (SELECT id FROM job_seeker_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Job seekers can update own applications" ON applications FOR UPDATE USING (job_seeker_id IN (SELECT id FROM job_seeker_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Employers can update applications for their jobs" ON applications FOR UPDATE USING (job_id IN (SELECT id FROM jobs WHERE employer_id IN (SELECT id FROM employer_profiles WHERE user_id = auth.uid())));

-- RLS Policies for saved_jobs
CREATE POLICY "Job seekers can view own saved jobs" ON saved_jobs FOR SELECT USING (job_seeker_id IN (SELECT id FROM job_seeker_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Job seekers can save jobs" ON saved_jobs FOR INSERT WITH CHECK (job_seeker_id IN (SELECT id FROM job_seeker_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Job seekers can unsave jobs" ON saved_jobs FOR DELETE USING (job_seeker_id IN (SELECT id FROM job_seeker_profiles WHERE user_id = auth.uid()));

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view own conversations" ON chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON chat_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON chat_conversations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in own conversations" ON chat_messages FOR SELECT USING (conversation_id IN (SELECT id FROM chat_conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users can create messages in own conversations" ON chat_messages FOR INSERT WITH CHECK (conversation_id IN (SELECT id FROM chat_conversations WHERE user_id = auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON job_seeker_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON employer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON chat_conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'job_seeker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_job_seeker_id ON applications(job_seeker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_saved_jobs_job_seeker_id ON saved_jobs(job_seeker_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);