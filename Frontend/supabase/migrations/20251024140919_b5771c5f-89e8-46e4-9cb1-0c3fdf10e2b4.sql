-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'job_seeker',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view all profiles') THEN
    CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Create trigger to automatically create profile on signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Create employer_profiles table
CREATE TABLE IF NOT EXISTS public.employer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT NOT NULL,
  company_logo TEXT,
  company_website TEXT,
  company_size TEXT,
  industry TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employer_profiles' AND policyname = 'Anyone can view employer profiles') THEN
    CREATE POLICY "Anyone can view employer profiles" ON public.employer_profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employer_profiles' AND policyname = 'Employers can insert own profile') THEN
    CREATE POLICY "Employers can insert own profile" ON public.employer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employer_profiles' AND policyname = 'Employers can update own profile') THEN
    CREATE POLICY "Employers can update own profile" ON public.employer_profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create job_seeker_profiles table
CREATE TABLE IF NOT EXISTS public.job_seeker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  resume_url TEXT,
  skills TEXT[],
  job_preferences TEXT[],
  experience_years INTEGER,
  desired_salary_min INTEGER,
  desired_salary_max INTEGER,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_seeker_profiles' AND policyname = 'Anyone can view job seeker profiles') THEN
    CREATE POLICY "Anyone can view job seeker profiles" ON public.job_seeker_profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_seeker_profiles' AND policyname = 'Job seekers can insert own profile') THEN
    CREATE POLICY "Job seekers can insert own profile" ON public.job_seeker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'job_seeker_profiles' AND policyname = 'Job seekers can update own profile') THEN
    CREATE POLICY "Job seekers can update own profile" ON public.job_seeker_profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
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
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Anyone can view active jobs') THEN
    CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (
      is_active = true OR employer_id IN (
        SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Employers can insert jobs') THEN
    CREATE POLICY "Employers can insert jobs" ON public.jobs FOR INSERT WITH CHECK (
      employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Employers can update own jobs') THEN
    CREATE POLICY "Employers can update own jobs" ON public.jobs FOR UPDATE USING (
      employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'Employers can delete own jobs') THEN
    CREATE POLICY "Employers can delete own jobs" ON public.jobs FOR DELETE USING (
      employer_id IN (SELECT id FROM public.employer_profiles WHERE user_id = auth.uid())
    );
  END IF;
END $$;

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_seeker_id UUID NOT NULL REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  resume_url TEXT,
  cover_letter TEXT,
  ai_match_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Job seekers can view own applications') THEN
    CREATE POLICY "Job seekers can view own applications" ON public.applications FOR SELECT USING (
      job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Job seekers can create applications') THEN
    CREATE POLICY "Job seekers can create applications" ON public.applications FOR INSERT WITH CHECK (
      job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Job seekers can update own applications') THEN
    CREATE POLICY "Job seekers can update own applications" ON public.applications FOR UPDATE USING (
      job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Employers can view applications for their jobs') THEN
    CREATE POLICY "Employers can view applications for their jobs" ON public.applications FOR SELECT USING (
      job_id IN (SELECT id FROM public.jobs WHERE employer_id IN (
        SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
      ))
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'applications' AND policyname = 'Employers can update applications for their jobs') THEN
    CREATE POLICY "Employers can update applications for their jobs" ON public.applications FOR UPDATE USING (
      job_id IN (SELECT id FROM public.jobs WHERE employer_id IN (
        SELECT id FROM public.employer_profiles WHERE user_id = auth.uid()
      ))
    );
  END IF;
END $$;

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_seeker_id UUID NOT NULL REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(job_seeker_id, job_id)
);

ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_jobs' AND policyname = 'Job seekers can view own saved jobs') THEN
    CREATE POLICY "Job seekers can view own saved jobs" ON public.saved_jobs FOR SELECT USING (
      job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_jobs' AND policyname = 'Job seekers can save jobs') THEN
    CREATE POLICY "Job seekers can save jobs" ON public.saved_jobs FOR INSERT WITH CHECK (
      job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'saved_jobs' AND policyname = 'Job seekers can unsave jobs') THEN
    CREATE POLICY "Job seekers can unsave jobs" ON public.saved_jobs FOR DELETE USING (
      job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE user_id = auth.uid())
    );
  END IF;
END $$;

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Users can view own conversations') THEN
    CREATE POLICY "Users can view own conversations" ON public.chat_conversations FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Users can create conversations') THEN
    CREATE POLICY "Users can create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Users can update own conversations') THEN
    CREATE POLICY "Users can update own conversations" ON public.chat_conversations FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_conversations' AND policyname = 'Users can delete own conversations') THEN
    CREATE POLICY "Users can delete own conversations" ON public.chat_conversations FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can view messages in own conversations') THEN
    CREATE POLICY "Users can view messages in own conversations" ON public.chat_messages FOR SELECT USING (
      conversation_id IN (SELECT id FROM public.chat_conversations WHERE user_id = auth.uid())
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_messages' AND policyname = 'Users can create messages in own conversations') THEN
    CREATE POLICY "Users can create messages in own conversations" ON public.chat_messages FOR INSERT WITH CHECK (
      conversation_id IN (SELECT id FROM public.chat_conversations WHERE user_id = auth.uid())
    );
  END IF;
END $$;

-- Create triggers for updated_at columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_employer_profiles_updated_at') THEN
    CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON public.employer_profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_job_seeker_profiles_updated_at') THEN
    CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON public.job_seeker_profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_jobs_updated_at') THEN
    CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_applications_updated_at') THEN
    CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_chat_conversations_updated_at') THEN
    CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;