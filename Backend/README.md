# Resume Screening API

AI-powered resume screening system with two intelligent agents built using LangGraph and LangChain.

## Features

### 🤖 Two Intelligent Agents

1. **Resume Parser Agent**: Extracts structured candidate profiles from PDF, DOC, and DOCX files
2. **Decision Agent**: Evaluates candidates against job descriptions and provides recommendations

### 📊 What You Get

- **Candidate Profile**: Name, contact, skills, experience, education, certifications
- **Decision Output**:
  - Confidence score (0-100)
  - Recommendation (hire/interview/reject)
  - Advantages & disadvantages
  - Skills match percentage
  - Experience match assessment
  - Comprehensive summary

## Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**:

```bash
pip install -r requirements.txt
```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

## Usage

### Start the API Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

### Endpoints

#### 1. Screen Resume (Form Data)

**POST** `/screen`

**Parameters**:
- `resume`: File (PDF, DOC, or DOCX)
- `job_title`: String
- `job_description`: String
- `required_skills`: String (comma-separated)
- `preferred_skills`: String (comma-separated, optional)
- `experience_required`: Integer (optional)

**Example using cURL**:
```bash
curl -X POST "http://localhost:8000/screen" \
  -F "resume=@resume.pdf" \
  -F "job_title=Senior Software Engineer" \
  -F "job_description=We are looking for an experienced software engineer..." \
  -F "required_skills=Python, FastAPI, LangChain, Docker" \
  -F "preferred_skills=AWS, Kubernetes" \
  -F "experience_required=5"
```

#### 2. Screen Resume (JSON Format)

**POST** `/screen-json`

**Parameters**:
- `resume`: File (PDF, DOC, or DOCX)
- `job_data`: JSON string

**Example job_data**:
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer...",
  "required_skills": ["Python", "FastAPI", "LangChain"],
  "preferred_skills": ["Docker", "AWS"],
  "experience_required": 5
}
```

#### 3. Health Check

**GET** `/health`

Returns API health status.

### Response Example

```json
{
  "candidate_profile": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "summary": "Experienced software engineer with 7 years...",
    "skills": ["Python", "FastAPI", "Docker", "AWS"],
    "experience": [
      "Senior Software Engineer at Tech Corp (2020-2023)",
      "Software Engineer at StartUp Inc (2017-2020)"
    ],
    "education": [
      "BS in Computer Science, University XYZ (2017)"
    ],
    "certifications": ["AWS Certified Developer"],
    "years_of_experience": 7
  },
  "decision": {
    "confidence_score": 85.5,
    "recommendation": "hire",
    "advantages": [
      "Strong technical skills matching requirements",
      "Relevant industry experience",
      "Proven track record in similar roles"
    ],
    "disadvantages": [
      "Limited experience with Kubernetes",
      "No mention of CI/CD practices"
    ],
    "skill_match_percentage": 87.5,
    "experience_match": "Exceeds requirements (7 years vs 5 required)",
    "summary": "Strong candidate with excellent technical skills..."
  },
  "status": "success"
}
```

## Architecture

### LangGraph Workflow

```
┌─────────────────┐
│  Upload Resume  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Parse Resume   │ ◄── Agent 1: Resume Parser
│  Agent          │     - Extracts text from PDF/DOC/DOCX
└────────┬────────┘     - Uses LLM to structure data
         │
         ▼
┌─────────────────┐
│  Decision       │ ◄── Agent 2: Decision Agent
│  Agent          │     - Compares profile vs job
└────────┬────────┘     - Calculates match scores
         │              - Provides recommendations
         ▼
┌─────────────────┐
│  Return Result  │
└─────────────────┘
```

## Project Structure

```
jobagentapi/
├── main.py              # FastAPI application
├── agent_graph.py       # LangGraph workflow
├── resume_parser.py     # Resume parsing agent
├── decision_agent.py    # Decision making agent
├── models.py            # Pydantic models
├── config.py            # Configuration
├── requirements.txt     # Dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Technologies Used

- **FastAPI**: High-performance web framework
- **LangGraph**: Multi-agent workflow orchestration
- **LangChain**: LLM application framework
- **OpenAI GPT-4**: Language model for intelligent processing
- **PyPDF2**: PDF parsing
- **python-docx**: DOCX parsing
- **Pydantic**: Data validation

## Error Handling

The API includes comprehensive error handling:
- Invalid file formats
- Empty files
- Parsing errors
- LLM processing errors
- Invalid job descriptions

## Notes

- Supports PDF, DOCX formats (DOC requires conversion to DOCX)
- Uses GPT-4 Turbo for high-quality analysis
- Structured output ensures consistent results
- Async/await for optimal performance

## Future Enhancements

- [ ] Support for more file formats (TXT, HTML)
- [ ] Batch processing multiple resumes
- [ ] Resume ranking and comparison
- [ ] Custom evaluation criteria
- [ ] Database integration for resume storage
- [ ] Email notifications
- [ ] Resume anonymization option

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
