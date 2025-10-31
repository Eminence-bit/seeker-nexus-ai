# 🚀 Quick Setup Checklist

Use this checklist to get the AI-powered job portal with resume screening up and running quickly.

## ✅ Prerequisites Check

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 🔧 Backend Setup (5 minutes)

### 1. Navigate to Backend
```bash
cd Backend
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Add your API key to `.env`:
```env
MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 5. Test Backend
```bash
python main.py
```
- [ ] Server starts on `http://localhost:8000`
- [ ] Visit `http://localhost:8000/docs` to see API documentation
- [ ] Visit `http://localhost:8000/health` to verify it's working

## 🎨 Frontend Setup (3 minutes)

### 1. Navigate to Frontend
```bash
cd Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Environment Variables
Check that `Frontend/.env` contains:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Start Frontend
```bash
npm run dev
```
- [ ] Frontend starts on `http://localhost:5173`
- [ ] Homepage loads successfully

## 🧪 Integration Testing (2 minutes)

### 1. Test Backend Connection
- [ ] Visit `http://localhost:5173/test-backend`
- [ ] Click "Run API Tests"
- [ ] Verify "GET /health" shows "SUCCESS"

### 2. Test Resume Screening
- [ ] Visit `http://localhost:5173/resume-screening`
- [ ] Check that "Backend API Status" shows "CONNECTED"
- [ ] Upload a test resume (PDF/DOC/DOCX)
- [ ] Fill in job details
- [ ] Click "Screen Resume"
- [ ] Verify AI analysis results appear

## 🎯 Key Features to Test

### Resume Screening Features
- [ ] File upload (PDF, DOC, DOCX)
- [ ] Job title and description input
- [ ] Required and preferred skills
- [ ] AI analysis with confidence score
- [ ] Candidate profile extraction
- [ ] Hiring recommendation
- [ ] Advantages and disadvantages list

### Navigation
- [ ] Home page loads
- [ ] AI Screening link in navbar works
- [ ] Job portal functionality
- [ ] Dashboard access (if authenticated)

## 🚨 Troubleshooting

### Backend Issues
| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| API key error | Check `.env` file has correct API key |
| Port 8000 in use | Kill existing process or change port |

### Frontend Issues
| Problem | Solution |
|---------|----------|
| `npm install` fails | Try `npm install --legacy-peer-deps` |
| Backend connection fails | Ensure backend is running on port 8000 |
| CORS errors | Check backend CORS configuration |

### Integration Issues
| Problem | Solution |
|---------|----------|
| "Backend Status: OFFLINE" | Restart backend server |
| File upload fails | Check file type (PDF/DOC/DOCX only) |
| AI analysis fails | Verify API key is working |

## 📁 File Structure Verification

Ensure these key files exist:

### Backend
- [ ] `Backend/main.py` - FastAPI server
- [ ] `Backend/.env` - Environment variables
- [ ] `Backend/requirements.txt` - Dependencies
- [ ] `Backend/agent_graph.py` - LangGraph workflow
- [ ] `Backend/resume_parser.py` - Resume parsing agent
- [ ] `Backend/decision_agent.py` - Decision making agent

### Frontend
- [ ] `Frontend/src/components/ResumeScreening.tsx` - Main screening UI
- [ ] `Frontend/src/lib/api.ts` - Backend API integration
- [ ] `Frontend/src/pages/ResumeScreening.tsx` - Screening page
- [ ] `Frontend/src/pages/TestBackend.tsx` - Testing page
- [ ] `Frontend/.env` - Environment variables

## 🎉 Success Criteria

You've successfully set up the system when:

1. ✅ Backend API responds at `http://localhost:8000/health`
2. ✅ Frontend loads at `http://localhost:5173`
3. ✅ `/test-backend` shows all green status indicators
4. ✅ `/resume-screening` can upload files and show AI analysis
5. ✅ No console errors in browser developer tools
6. ✅ Backend logs show successful API calls

## 🚀 Next Steps

Once everything is working:

1. **Explore Features**: Try different resume types and job descriptions
2. **Customize**: Modify prompts in `resume_parser.py` and `decision_agent.py`
3. **Deploy**: Follow deployment guides in main README
4. **Integrate**: Add to existing job portal workflows
5. **Monitor**: Set up logging and error tracking

## 📞 Need Help?

- Check the `INTEGRATION_GUIDE.md` for technical details
- Review backend logs for API errors
- Use browser developer tools for frontend debugging
- Test individual components using `/test-backend`

---

**Estimated Total Setup Time: ~10 minutes**

Once complete, you'll have a fully functional AI-powered resume screening system integrated with a modern job portal interface!