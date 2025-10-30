# Frontend-Backend Integration Guide

This document explains how the React frontend integrates with the Python FastAPI backend for AI-powered resume screening.

## 🏗️ Architecture Overview

```
Frontend (React/TypeScript)     Backend (Python/FastAPI)
┌─────────────────────────┐    ┌──────────────────────────┐
│  ResumeScreening.tsx    │    │  main.py (FastAPI)       │
│  ├─ File Upload         │◄──►│  ├─ /screen endpoint     │
│  ├─ Job Form            │    │  ├─ /screen-json         │
│  └─ Results Display     │    │  └─ /health              │
└─────────────────────────┘    └──────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────┐    ┌──────────────────────────┐
│  api.ts (API Layer)     │    │  agent_graph.py          │
│  ├─ screenResume()      │    │  ├─ Resume Parser Agent  │
│  ├─ healthCheck()       │    │  └─ Decision Agent       │
│  └─ Error Handling      │    └──────────────────────────┘
└─────────────────────────┘
```

## 🔌 API Integration

### 1. API Service Layer (`Frontend/src/lib/api.ts`)

Centralized API calls with TypeScript types:

```typescript
export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Resume screening
  async screenResume(
    resumeFile: File,
    jobTitle: string,
    jobDescription: string,
    requiredSkills: string,
    preferredSkills?: string,
    experienceRequired?: string
  ): Promise<ScreeningResponse> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_title', jobTitle);
    // ... other fields
    
    const response = await fetch(`${API_BASE_URL}/screen`, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  }
};
```

### 2. Environment Configuration

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:8000
```

**Backend** (`.env`):
```env
MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=your_api_key
```

### 3. CORS Configuration

Backend automatically handles CORS for frontend requests:

```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🎨 UI Components

### 1. ResumeScreening Component

Main interface for AI resume screening:

```typescript
const ResumeScreening = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      const data = await api.screenResume(/* params */);
      setResult(data);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // UI with file upload, form, and results display
  );
};
```

### 2. BackendStatus Component

Real-time API connectivity monitoring:

```typescript
const BackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const checkBackendStatus = async () => {
    try {
      await api.healthCheck();
      setStatus('online');
    } catch (error) {
      setStatus('offline');
    }
  };
  
  // UI with status indicator and refresh button
};
```

## 📡 API Endpoints

### 1. Health Check
```http
GET /health
Response: { "status": "healthy" }
```

### 2. Resume Screening (Form Data)
```http
POST /screen
Content-Type: multipart/form-data

Fields:
- resume: File (PDF/DOC/DOCX)
- job_title: string
- job_description: string
- required_skills: string (comma-separated)
- preferred_skills: string (optional)
- experience_required: integer (optional)
```

### 3. Resume Screening (JSON)
```http
POST /screen-json
Content-Type: multipart/form-data

Fields:
- resume: File
- job_data: JSON string
```

## 🔄 Data Flow

### 1. File Upload Process

```
User selects file → Validation → FormData creation → API call → Backend processing → Response handling → UI update
```

### 2. Error Handling

```typescript
try {
  const data = await api.screenResume(/* params */);
  // Success handling
} catch (error) {
  toast({
    title: "Screening Failed",
    description: error.message,
    variant: "destructive",
  });
}
```

### 3. Loading States

```typescript
// Loading indicator during API call
{loading && (
  <div className="text-center py-8">
    <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
    <p>AI Analysis in Progress...</p>
  </div>
)}
```

## 🧪 Testing Integration

### 1. Backend Testing Page (`/test-backend`)

Diagnostic interface for API connectivity:
- Health check endpoint testing
- Configuration display
- Error diagnostics

### 2. Manual Testing Steps

1. Start backend: `cd Backend && python main.py`
2. Start frontend: `cd Frontend && npm run dev`
3. Visit `/test-backend` to verify connectivity
4. Test resume screening at `/resume-screening`

### 3. Error Scenarios

Common issues and solutions:

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS Error | Backend not allowing frontend origin | Update CORS settings |
| 404 Error | Backend not running | Start backend server |
| File Upload Error | Invalid file type | Check file validation |
| API Key Error | Missing/invalid API key | Verify environment variables |

## 🚀 Deployment Considerations

### 1. Environment Variables

**Production Frontend**:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

**Production Backend**:
```env
# Update CORS for production frontend URL
```

### 2. File Upload Limits

Ensure consistent limits between frontend and backend:
- Frontend: File size validation
- Backend: FastAPI file size limits
- Server: Nginx/Apache upload limits

### 3. Error Monitoring

Implement proper error tracking:
- Frontend: Browser console logs
- Backend: Server logs and monitoring
- API: Response time and error rate monitoring

## 📚 TypeScript Types

Shared types for API responses:

```typescript
interface CandidateProfile {
  name: string;
  email?: string;
  phone?: string;
  summary: string;
  skills: string[];
  experience: string[];
  education: string[];
  certifications: string[];
  years_of_experience?: number;
}

interface DecisionOutput {
  confidence_score: number;
  recommendation: string;
  advantages: string[];
  disadvantages: string[];
  skill_match_percentage: number;
  experience_match: string;
  summary: string;
}

interface ScreeningResponse {
  candidate_profile: CandidateProfile;
  decision: DecisionOutput;
  status: string;
}
```

## 🔧 Development Workflow

1. **Backend Development**: Make changes to Python API
2. **API Testing**: Use `/test-backend` or Postman
3. **Frontend Integration**: Update API calls and UI
4. **End-to-End Testing**: Test complete workflow
5. **Error Handling**: Implement proper error states
6. **Documentation**: Update this guide as needed

## 📞 Troubleshooting

### Common Issues

1. **Backend not starting**: Check Python dependencies and API keys
2. **CORS errors**: Verify backend CORS configuration
3. **File upload fails**: Check file type validation and size limits
4. **API responses empty**: Verify backend processing and LLM configuration
5. **Frontend build errors**: Check TypeScript types and imports

### Debug Steps

1. Check browser console for frontend errors
2. Check backend logs for API errors
3. Verify environment variables are loaded
4. Test API endpoints directly with curl/Postman
5. Use `/test-backend` page for quick diagnostics

This integration provides a seamless experience for AI-powered resume screening while maintaining clean separation between frontend and backend concerns.