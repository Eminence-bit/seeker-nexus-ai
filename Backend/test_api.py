"""
Test script to demonstrate the Resume Screening API usage
"""
import requests
import json

# API endpoint
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_screen_resume():
    """Test resume screening endpoint"""
    print("Testing resume screening...")
    
    # Prepare the job description
    job_data = {
        "job_title": "Senior Python Developer",
        "job_description": "We are seeking an experienced Python developer with expertise in FastAPI and LangChain",
        "required_skills": "Python, FastAPI, LangChain, REST APIs",
        "preferred_skills": "Docker, AWS, PostgreSQL",
        "experience_required": 5
    }
    
    # Upload a resume file (you need to have a test resume)
    # Example: test_resume.pdf
    files = {
        'resume': ('test_resume.pdf', open('test_resume.pdf', 'rb'), 'application/pdf')
    }
    
    response = requests.post(
        f"{BASE_URL}/screen",
        files=files,
        data=job_data
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("\n=== CANDIDATE PROFILE ===")
        print(json.dumps(result['candidate_profile'], indent=2))
        print("\n=== DECISION ===")
        print(json.dumps(result['decision'], indent=2))
    else:
        print(f"Error: {response.text}")

def test_screen_resume_json():
    """Test resume screening with JSON job description"""
    print("Testing resume screening (JSON format)...")
    
    job_data = {
        "title": "Senior Python Developer",
        "description": "We are seeking an experienced Python developer with expertise in FastAPI and LangChain",
        "required_skills": ["Python", "FastAPI", "LangChain", "REST APIs"],
        "preferred_skills": ["Docker", "AWS", "PostgreSQL"],
        "experience_required": 5
    }
    
    files = {
        'resume': ('test_resume.pdf', open('test_resume.pdf', 'rb'), 'application/pdf')
    }
    
    data = {
        'job_data': json.dumps(job_data)
    }
    
    response = requests.post(
        f"{BASE_URL}/screen-json",
        files=files,
        data=data
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print("\n=== CANDIDATE PROFILE ===")
        print(json.dumps(result['candidate_profile'], indent=2))
        print("\n=== DECISION ===")
        print(json.dumps(result['decision'], indent=2))
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    print("=== Resume Screening API Test ===\n")
    
    # Test health check
    try:
        test_health()
    except Exception as e:
        print(f"Health check failed: {e}\n")
    
    # Test resume screening
    # Note: You need to have a test_resume.pdf file in the same directory
    # Uncomment the line below once you have a test resume
    # test_screen_resume()
    
    print("\nTo test resume screening, make sure to:")
    print("1. Start the API server: python main.py")
    print("2. Place a test resume file (test_resume.pdf) in this directory")
    print("3. Uncomment the test_screen_resume() call in this script")
