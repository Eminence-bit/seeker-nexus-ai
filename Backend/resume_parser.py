import PyPDF2
import docx
from typing import BinaryIO
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from models import CandidateProfile
import config


class ResumeParser:
    """Agent for parsing resumes and extracting candidate profiles"""

    def __init__(self):
        self.llm = self._get_llm()

    def _get_llm(self):
        """Get the appropriate LLM based on configuration"""
        if config.MODEL_PROVIDER == "openai":
            return ChatOpenAI(
                model=config.OPENAI_MODEL,
                temperature=0,
                openai_api_key=config.OPENAI_API_KEY
            )
        elif config.MODEL_PROVIDER == "openrouter":
            return ChatOpenAI(
                model=config.OPENROUTER_MODEL,
                temperature=0,
                openai_api_key=config.OPENROUTER_API_KEY,
                openai_api_base="https://openrouter.ai/api/v1"
            )
        elif config.MODEL_PROVIDER == "ollama":
            return ChatOllama(
                model=config.OLLAMA_MODEL,
                temperature=0,
                base_url=config.OLLAMA_BASE_URL
            )
        else:
            raise ValueError(f"Unsupported model provider: {config.MODEL_PROVIDER}")

    def extract_text_from_pdf(self, file: BinaryIO) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error reading PDF: {str(e)}")

    def extract_text_from_docx(self, file: BinaryIO) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error reading DOCX: {str(e)}")

    def extract_text_from_doc(self, file: BinaryIO) -> str:
        """Extract text from DOC file (legacy format)"""
        # For .doc files, you might need additional libraries like antiword or textract
        # For now, we'll raise an error suggesting conversion
        raise ValueError("Legacy .doc format not fully supported. Please convert to .docx or PDF")

    def extract_text(self, file: BinaryIO, filename: str) -> str:
        """Extract text based on file extension"""
        if filename.lower().endswith('.pdf'):
            return self.extract_text_from_pdf(file)
        elif filename.lower().endswith('.docx'):
            return self.extract_text_from_docx(file)
        elif filename.lower().endswith('.doc'):
            return self.extract_text_from_doc(file)
        else:
            raise ValueError("Unsupported file format. Please upload PDF, DOC, or DOCX")

    def parse_resume(self, file: BinaryIO, filename: str) -> CandidateProfile:
        """Parse resume and create candidate profile"""
        # Extract text from document
        resume_text = self.extract_text(file, filename)

        if not resume_text or len(resume_text.strip()) < 50:
            raise ValueError("Resume appears to be empty or too short")

        # Create prompt for LLM
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert resume parser. Extract structured information from the resume text.
            Be thorough and accurate. If information is not available, use appropriate defaults.

            {format_instructions}"""),
            ("user", "Resume Text:\n\n{resume_text}")
        ])

        # Parse resume using LLM
        chain = prompt | self.llm

        format_instructions = self.parser.get_format_instructions()

        response = chain.invoke({
            "resume_text": resume_text,
            "format_instructions": format_instructions
        })

        # Parse the response into CandidateProfile
        try:
            candidate_profile = self.parser.parse(response.content)
            return candidate_profile
        except Exception as e:
            # Fallback: try to extract JSON from response
            import json
            import re

            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                data = json.loads(json_str)
                return CandidateProfile(**data)
            else:
                raise ValueError(f"Failed to parse resume: {str(e)}")

    @property
    def parser(self):
        """Lazy initialization of parser"""
        if not hasattr(self, '_parser'):
            self._parser = PydanticOutputParser(pydantic_object=CandidateProfile)
        return self._parser
