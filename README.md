# Seeker Nexus AI

A comprehensive AI-powered job portal with resume screening capabilities. This project combines a Python backend with LangGraph agents and a modern React frontend to provide intelligent job matching and resume analysis.

## 🚀 Features

### Backend (AI Resume Screening API)
- **Dual AI Agents**: Resume Parser + Decision Agent using LangGraph
- **Multi-format Support**: PDF, DOC, DOCX resume parsing
- **Intelligent Analysis**: Skill matching, experience evaluation, hiring recommendations
- **Flexible API**: Both form-data and JSON endpoints
- **Multiple LLM Support**: OpenAI, OpenRouter, and Ollama integration

### Frontend (Job Portal UI)
- **Modern React Interface**: Built with Vite, TypeScript, and Tailwind CSS
- **AI Resume Screening**: Interactive file upload and analysis interface
- **Job Portal**: Browse jobs, apply, and manage applications
- **Dashboard**: Separate views for job seekers and employers
- **Real-time Status**: Backend connectivity monitoring
- **Responsive Design**: Mobile-friendly interface

## Repository Layout

- `Backend/` - Python FastAPI server with LangGraph agents for resume screening
- `Frontend/` - React/TypeScript UI with Supabase integration and backend API calls

## 🛠️ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Backend Setup (AI Resume Screening API)

```bash
cd Backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys (OpenAI, OpenRouter, or Ollama)

# Start the API server
python main.py
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 2. Frontend Setup (Job Portal UI)

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Key Pages & Features

- **Home**: `/` - Landing page with feature overview
- **AI Resume Screening**: `/resume-screening` - Upload resumes for AI analysis
- **Job Portal**: `/jobs` - Browse and search job listings
- **Dashboard**: `/dashboard` - User dashboard (job seekers & employers)
- **Backend Testing**: `/test-backend` - API connectivity diagnostics

### 4. Testing the Integration

1. Ensure both backend and frontend are running
2. Visit `/test-backend` to verify API connectivity
3. Go to `/resume-screening` to test the AI analysis
4. Upload a resume with job details to see the complete workflow

## 🔧 Configuration

### Backend Environment Variables
```env
# Model Provider (openai, openrouter, ollama)
MODEL_PROVIDER=openrouter

# API Keys
OPENAI_API_KEY=your_openai_key
OPENROUTER_API_KEY=your_openrouter_key

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# Model Names (optional)
OPENAI_MODEL=gpt-4-turbo-preview
OPENROUTER_MODEL=microsoft/wizardlm-2-8x22b
OLLAMA_MODEL=qwen3:8b
```

### Frontend Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Backend API
VITE_API_BASE_URL=http://localhost:8000
```

## 🏗️ Architecture

### Backend (LangGraph Workflow)
```
Resume Upload → Parse Resume Agent → Decision Agent → Response
     ↓              ↓                    ↓             ↓
   PDF/DOCX    Extract Profile    Evaluate Match   JSON Result
```

### Frontend (React Components)
- **ResumeScreening**: Main AI screening interface
- **BackendStatus**: Real-time API monitoring
- **Dashboard**: Role-based user interfaces
- **JobPortal**: Job browsing and application management

## 📚 API Documentation

### Resume Screening Endpoints

**POST /screen** - Screen resume with form data
```bash
curl -X POST "http://localhost:8000/screen" \
  -F "resume=@resume.pdf" \
  -F "job_title=Senior Developer" \
  -F "job_description=..." \
  -F "required_skills=Python,React,AWS"
```

**POST /screen-json** - Screen resume with JSON data
```bash
curl -X POST "http://localhost:8000/screen-json" \
  -F "resume=@resume.pdf" \
  -F 'job_data={"title":"Senior Developer","required_skills":["Python","React"]}'
```

**GET /health** - Health check
```bash
curl http://localhost:8000/health
```

## 🧪 Testing

### Backend Testing
```bash
cd Backend
python test_api.py
```

### Frontend Testing
- Visit `/test-backend` for API connectivity tests
- Use `/resume-screening` for end-to-end testing
- Check browser console for detailed error logs

## 🚀 Deployment

### Backend Deployment
- Deploy to any Python-compatible platform (Heroku, Railway, DigitalOcean)
- Ensure environment variables are configured
- Update CORS settings for production frontend URL

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update `VITE_API_BASE_URL` to production backend URL

## Supabase Integration

This project uses Supabase for user authentication and job data management. Functions and migrations are located in `Frontend/supabase/`.

## 💡 Useful Tips

- Keep API keys secure using environment variables
- Test backend connectivity before debugging frontend issues
- Use the `/test-backend` page for quick API diagnostics
- Check both browser console and backend logs for errors
- Ensure file upload limits match between frontend and backend

## Contributors & contribution notes

This is a closed departmental project. Contributor usernames will be added to this file by the project maintainers — no public contribution details are listed here.

## Contact

If you need help, open an issue describing the environment and steps to reproduce.
