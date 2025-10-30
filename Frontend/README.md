# Seeker Nexus AI - AI-Powered Job Portal

<div align="center">

![AI Job Portal](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)

*Connecting talent with opportunity through the power of Artificial Intelligence*

</div>

## 📋 Overview

Seeker Nexus AI is a modern, AI-powered job portal that revolutionizes the way job seekers find opportunities and employers discover talent. Built with cutting-edge technologies, the platform features intelligent job matching, an AI career assistant, and seamless user experiences for both job seekers and employers.

## ✨ Key Features

### 🧠 AI Resume Screening (NEW!)

- **Intelligent Resume Analysis** - Upload resumes and get AI-powered candidate evaluation
- **Skill Matching** - Automatic skill extraction and job requirement matching
- **Hiring Recommendations** - AI-generated hire/interview/reject recommendations with confidence scores
- **Detailed Candidate Profiles** - Structured extraction of experience, education, and certifications
- **Multi-format Support** - PDF, DOC, and DOCX resume parsing

### For Job Seekers

- 🤖 **AI-Powered Job Matching** - Get personalized job recommendations based on your skills and experience
- 💬 **AI Career Assistant** - Chat with an intelligent assistant for career advice and guidance
- 🔍 **Advanced Job Search** - Filter and search for jobs by location, type, experience level, and more
- 📊 **Application Tracking** - Monitor your job applications in one centralized dashboard
- 📝 **Profile Management** - Create and manage a comprehensive professional profile

### For Employers

- 🧠 **AI Resume Screening** - Upload and analyze candidate resumes with AI-powered insights
- 📢 **Job Posting** - Easy-to-use interface for posting job opportunities
- 👥 **Candidate Management** - View and manage job applications efficiently
- 🏢 **Company Profiles** - Showcase your company to attract top talent
- 📈 **Application Analytics** - Track views and applications for your job postings

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend Integration
- **AI Resume Screening API**: Python FastAPI with LangGraph agents
- **Database**: Supabase (PostgreSQL)
- **File Upload**: Multi-format resume parsing (PDF, DOC, DOCX)
- **AI Models**: OpenAI GPT-4, OpenRouter, or Ollama support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or Bun)
- Git
- A Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eminence-bit/seeker-nexus-ai.git
   cd seeker-nexus-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or if using Bun
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   
   # Backend API Configuration
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run database migrations**
   
   Use the Supabase CLI or dashboard to run the migrations in `supabase/migrations/`

5. **Start the backend server** (for AI Resume Screening)
   ```bash
   cd ../Backend
   python main.py
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎯 Usage

### Demo Credentials

For testing purposes, you can create demo accounts or refer to `DEMO_CREDENTIALS.md` for sample data:

**Employer Account:**
- Email: `employer@demo.com`
- Password: `demo123456`

**Job Seeker Account:**
- Email: `jobseeker@demo.com`
- Password: `demo123456`

### Main Routes

- `/` - Landing page with feature overview
- `/auth` - Login/Signup page
- `/jobs` - Browse all job listings
- `/jobs/:id` - Individual job details and application
- `/dashboard` - User dashboard (Job Seeker or Employer view)
- `/resume-screening` - **NEW!** AI-powered resume screening interface
- `/test-backend` - Backend API connectivity testing
- `/chat` - AI Career Assistant chat interface
- `/about` - About the platform

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── ResumeScreening.tsx  # AI resume screening component
│   │   ├── BackendStatus.tsx    # Backend connectivity status
│   │   └── Navbar.tsx   # Navigation component
│   ├── pages/           # Page components (routes)
│   │   ├── ResumeScreening.tsx  # AI screening page
│   │   └── TestBackend.tsx      # Backend testing page
│   ├── integrations/    # External service integrations
│   │   └── supabase/    # Supabase client and types
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   │   └── api.ts       # Backend API integration
│   └── assets/          # Static assets
├── supabase/
│   ├── migrations/      # Database migrations
│   └── functions/       # Edge functions (AI chat, etc.)
├── public/              # Public static files
└── ...config files
```

## 🧠 AI Resume Screening Features

### How It Works

1. **Upload Resume**: Drag and drop PDF, DOC, or DOCX files
2. **Job Details**: Enter job title, description, and required skills
3. **AI Analysis**: Backend processes resume using LangGraph agents
4. **Results**: Get detailed candidate profile and hiring recommendation

### What You Get

- **Candidate Profile**: Extracted name, contact, skills, experience, education
- **Decision Output**: 
  - Confidence score (0-100%)
  - Recommendation (hire/interview/reject)
  - Skill match percentage
  - Advantages and disadvantages
  - Experience level assessment
  - Comprehensive summary

### Backend Integration

The frontend connects to a Python FastAPI backend that uses:
- **LangGraph**: Multi-agent workflow orchestration
- **LangChain**: LLM application framework
- **Multiple LLM Support**: OpenAI GPT-4, OpenRouter, or Ollama
- **Document Parsing**: PyPDF2 and python-docx for file processing

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `profiles` - User profiles (job seekers & employers)
- `jobs` - Job postings
- `applications` - Job applications
- `employer_profiles` - Extended employer information
- `job_seeker_profiles` - Extended job seeker information

## 📝 License

This project is part of a learning/demo portfolio. Feel free to use it as inspiration for your own projects.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered development platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)
- Icons by [Lucide](https://lucide.dev)

## 📧 Contact

For questions or feedback, please open an issue in the GitHub repository.

---

<div align="center">

**[Report Bug](https://github.com/Eminence-bit/seeker-nexus-ai/issues)** | **[Request Feature](https://github.com/Eminence-bit/seeker-nexus-ai/issues)**

</div>
