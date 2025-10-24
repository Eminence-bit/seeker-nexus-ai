from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from models import CandidateProfile, JobDescription, DecisionOutput
import config


class DecisionAgent:
    """Agent for making hiring decisions based on candidate profile and job description"""

    def __init__(self):
        self.llm = self._get_llm()

    def _get_llm(self):
        """Get the appropriate LLM based on configuration"""
        if config.MODEL_PROVIDER == "openai":
            return ChatOpenAI(
                model=config.OPENAI_MODEL,
                temperature=0.3,
                openai_api_key=config.OPENAI_API_KEY
            )
        elif config.MODEL_PROVIDER == "openrouter":
            return ChatOpenAI(
                model=config.OPENROUTER_MODEL,
                temperature=0.3,
                openai_api_key=config.OPENROUTER_API_KEY,
                openai_api_base="https://openrouter.ai/api/v1"
            )
        elif config.MODEL_PROVIDER == "ollama":
            return ChatOllama(
                model=config.OLLAMA_MODEL,
                temperature=0.3,
                base_url=config.OLLAMA_BASE_URL
            )
        else:
            raise ValueError(f"Unsupported model provider: {config.MODEL_PROVIDER}")

    def evaluate_candidate(
        self,
        candidate_profile: CandidateProfile,
        job_description: JobDescription
    ) -> DecisionOutput:
        """Evaluate candidate against job description"""

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert HR recruiter and hiring manager.
            Analyze the candidate profile against the job description and provide a detailed evaluation.

            Consider:
            1. Skills match (required vs preferred)
            2. Experience level and relevance
            3. Educational qualifications
            4. Certifications and achievements
            5. Overall fit for the role

            Provide a confidence score (0-100), recommendation (hire/interview/reject),
            advantages, disadvantages, skill match percentage, and a comprehensive summary.

            {format_instructions}"""),
            ("user", """
Job Title: {job_title}
Job Description: {job_description}
Required Skills: {required_skills}
Preferred Skills: {preferred_skills}
Experience Required: {experience_required} years

Candidate Profile:
Name: {candidate_name}
Summary: {candidate_summary}
Skills: {candidate_skills}
Experience: {candidate_experience}
Education: {candidate_education}
Certifications: {candidate_certifications}
Years of Experience: {years_of_experience}

Analyze this candidate's fit for the position.
            """)
        ])

        chain = prompt | self.llm

        format_instructions = self.parser.get_format_instructions()

        response = chain.invoke({
            "format_instructions": format_instructions,
            "job_title": job_description.title,
            "job_description": job_description.description,
            "required_skills": ", ".join(job_description.required_skills),
            "preferred_skills": ", ".join(job_description.preferred_skills) if job_description.preferred_skills else "None",
            "experience_required": job_description.experience_required or "Not specified",
            "candidate_name": candidate_profile.name,
            "candidate_summary": candidate_profile.summary,
            "candidate_skills": ", ".join(candidate_profile.skills),
            "candidate_experience": "\n".join(candidate_profile.experience),
            "candidate_education": "\n".join(candidate_profile.education),
            "candidate_certifications": ", ".join(candidate_profile.certifications) if candidate_profile.certifications else "None",
            "years_of_experience": candidate_profile.years_of_experience or "Not specified"
        })

        # Parse the response into DecisionOutput
        try:
            decision = self.parser.parse(response.content)
            return decision
        except Exception as e:
            # Fallback: try to extract JSON from response
            import json
            import re

            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                data = json.loads(json_str)
                return DecisionOutput(**data)
            else:
                raise ValueError(f"Failed to parse decision: {str(e)}")

    @property
    def parser(self):
        """Lazy initialization of parser"""
        if not hasattr(self, '_parser'):
            self._parser = PydanticOutputParser(pydantic_object=DecisionOutput)
        return self._parser
