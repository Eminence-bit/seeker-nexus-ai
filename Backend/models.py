from pydantic import BaseModel, Field
from typing import Optional, List


class CandidateProfile(BaseModel):
    """Structured candidate profile extracted from resume"""
    name: str = Field(description="Candidate's full name")
    email: Optional[str] = Field(description="Email address")
    phone: Optional[str] = Field(description="Phone number")
    summary: str = Field(description="Professional summary")
    skills: List[str] = Field(description="List of technical and soft skills")
    experience: List[str] = Field(description="Work experience details")
    education: List[str] = Field(description="Educational qualifications")
    certifications: List[str] = Field(default=[], description="Professional certifications")
    years_of_experience: Optional[int] = Field(description="Total years of experience")


class JobDescription(BaseModel):
    """Job description input"""
    title: str = Field(description="Job title")
    description: str = Field(description="Full job description")
    required_skills: List[str] = Field(description="Required skills")
    preferred_skills: List[str] = Field(default=[], description="Preferred skills")
    experience_required: Optional[int] = Field(description="Years of experience required")


class DecisionOutput(BaseModel):
    """Decision agent output"""
    confidence_score: float = Field(description="Confidence score 0-100", ge=0, le=100)
    recommendation: str = Field(description="hire/interview/reject")
    advantages: List[str] = Field(description="Candidate's strengths")
    disadvantages: List[str] = Field(description="Candidate's weaknesses")
    skill_match_percentage: float = Field(description="Skills match percentage", ge=0, le=100)
    experience_match: str = Field(description="Experience level match assessment")
    summary: str = Field(description="Overall assessment summary")


class ScreeningRequest(BaseModel):
    """API request model"""
    job_description: JobDescription


class ScreeningResponse(BaseModel):
    """API response model"""
    candidate_profile: CandidateProfile
    decision: DecisionOutput
    status: str = "success"
