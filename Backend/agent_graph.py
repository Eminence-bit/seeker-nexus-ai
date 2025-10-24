from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from models import CandidateProfile, JobDescription, DecisionOutput
from resume_parser import ResumeParser
from decision_agent import DecisionAgent


class AgentState(TypedDict):
    """State shared between agents"""
    resume_file: bytes
    filename: str
    job_description: JobDescription
    candidate_profile: CandidateProfile | None
    decision: DecisionOutput | None
    error: str | None


class ResumeScreeningGraph:
    """LangGraph workflow for resume screening"""
    
    def __init__(self):
        self.resume_parser = ResumeParser()
        self.decision_agent = DecisionAgent()
        self.graph = self._build_graph()
    
    def _parse_resume_node(self, state: AgentState) -> AgentState:
        """Node 1: Parse resume and extract candidate profile"""
        try:
            from io import BytesIO
            file_obj = BytesIO(state["resume_file"])
            candidate_profile = self.resume_parser.parse_resume(
                file_obj, 
                state["filename"]
            )
            state["candidate_profile"] = candidate_profile
            state["error"] = None
        except Exception as e:
            state["error"] = f"Resume parsing failed: {str(e)}"
        
        return state
    
    def _decision_node(self, state: AgentState) -> AgentState:
        """Node 2: Make hiring decision"""
        try:
            if state["error"]:
                return state
            
            decision = self.decision_agent.evaluate_candidate(
                state["candidate_profile"],
                state["job_description"]
            )
            state["decision"] = decision
        except Exception as e:
            state["error"] = f"Decision making failed: {str(e)}"
        
        return state
    
    def _should_continue(self, state: AgentState) -> str:
        """Conditional edge: check if we should continue to decision agent"""
        if state["error"]:
            return "end"
        return "decision"
    
    def _build_graph(self) -> StateGraph:
        """Build the agent graph"""
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("parse_resume", self._parse_resume_node)
        workflow.add_node("decision", self._decision_node)
        
        # Set entry point
        workflow.set_entry_point("parse_resume")
        
        # Add edges
        workflow.add_conditional_edges(
            "parse_resume",
            self._should_continue,
            {
                "decision": "decision",
                "end": END
            }
        )
        
        workflow.add_edge("decision", END)
        
        return workflow.compile()
    
    def run(
        self, 
        resume_file: bytes, 
        filename: str, 
        job_description: JobDescription
    ) -> AgentState:
        """Execute the screening workflow"""
        initial_state: AgentState = {
            "resume_file": resume_file,
            "filename": filename,
            "job_description": job_description,
            "candidate_profile": None,
            "decision": None,
            "error": None
        }
        
        result = self.graph.invoke(initial_state)
        return result
