from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
from models import JobDescription, ScreeningResponse
from agent_graph import ResumeScreeningGraph

app = FastAPI(
    title="Resume Screening API",
    description="AI-powered resume screening with parsing and decision agents",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent graph
screening_graph = ResumeScreeningGraph()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Resume Screening API",
        "endpoints": {
            "POST /screen": "Screen a resume against job description",
            "GET /health": "Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/screen", response_model=ScreeningResponse)
async def screen_resume(
    resume: UploadFile = File(..., description="Resume file (PDF, DOC, or DOCX)"),
    job_title: str = Form(..., description="Job title"),
    job_description: str = Form(..., description="Full job description"),
    required_skills: str = Form(..., description="Comma-separated required skills"),
    preferred_skills: Optional[str] = Form(None, description="Comma-separated preferred skills"),
    experience_required: Optional[int] = Form(None, description="Years of experience required")
):
    """
    Screen a resume against a job description
    
    Returns:
    - Candidate profile extracted from resume
    - Decision output with recommendations
    """
    try:
        # Validate file type
        allowed_extensions = ['.pdf', '.doc', '.docx']
        file_ext = '.' + resume.filename.split('.')[-1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Read file content
        file_content = await resume.read()
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Parse skills
        required_skills_list = [s.strip() for s in required_skills.split(',') if s.strip()]
        preferred_skills_list = []
        if preferred_skills:
            preferred_skills_list = [s.strip() for s in preferred_skills.split(',') if s.strip()]
        
        # Create job description object
        job_desc = JobDescription(
            title=job_title,
            description=job_description,
            required_skills=required_skills_list,
            preferred_skills=preferred_skills_list,
            experience_required=experience_required
        )
        
        # Run the screening workflow
        result = screening_graph.run(
            resume_file=file_content,
            filename=resume.filename,
            job_description=job_desc
        )
        
        # Check for errors
        if result["error"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Return response
        return ScreeningResponse(
            candidate_profile=result["candidate_profile"],
            decision=result["decision"],
            status="success"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/screen-json", response_model=ScreeningResponse)
async def screen_resume_json(
    resume: UploadFile = File(..., description="Resume file (PDF, DOC, or DOCX)"),
    job_data: str = Form(..., description="Job description as JSON string")
):
    """
    Alternative endpoint that accepts job description as JSON
    
    Example job_data format:
    {
        "title": "Senior Software Engineer",
        "description": "We are looking for...",
        "required_skills": ["Python", "FastAPI", "LangChain"],
        "preferred_skills": ["Docker", "AWS"],
        "experience_required": 5
    }
    """
    try:
        # Parse job data JSON
        job_dict = json.loads(job_data)
        job_desc = JobDescription(**job_dict)
        
        # Validate file type
        allowed_extensions = ['.pdf', '.doc', '.docx']
        file_ext = '.' + resume.filename.split('.')[-1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed types: {', '.join(allowed_extensions)}"
            )
        
        # Read file content
        file_content = await resume.read()
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Run the screening workflow
        result = screening_graph.run(
            resume_file=file_content,
            filename=resume.filename,
            job_description=job_desc
        )
        
        # Check for errors
        if result["error"]:
            raise HTTPException(status_code=500, detail=result["error"])
        
        # Return response
        return ScreeningResponse(
            candidate_profile=result["candidate_profile"],
            decision=result["decision"],
            status="success"
        )
        
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in job_data")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
