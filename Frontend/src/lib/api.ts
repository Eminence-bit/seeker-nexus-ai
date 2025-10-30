// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Types for API responses
export interface CandidateProfile {
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

export interface DecisionOutput {
  confidence_score: number;
  recommendation: string;
  advantages: string[];
  disadvantages: string[];
  skill_match_percentage: number;
  experience_match: string;
  summary: string;
}

export interface ScreeningResponse {
  candidate_profile: CandidateProfile;
  decision: DecisionOutput;
  status: string;
}

export interface JobData {
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills?: string[];
  experience_required?: number;
}

// API functions
export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },

  // Screen resume with form data
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
    formData.append('job_description', jobDescription);
    formData.append('required_skills', requiredSkills);
    
    if (preferredSkills) {
      formData.append('preferred_skills', preferredSkills);
    }
    
    if (experienceRequired) {
      formData.append('experience_required', experienceRequired);
    }

    const response = await fetch(`${API_BASE_URL}/screen`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to screen resume');
    }

    return response.json();
  },

  // Screen resume with JSON data
  async screenResumeJson(
    resumeFile: File,
    jobData: JobData
  ): Promise<ScreeningResponse> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_data', JSON.stringify(jobData));

    const response = await fetch(`${API_BASE_URL}/screen-json`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to screen resume');
    }

    return response.json();
  },
};

// Utility functions
export const utils = {
  // Validate file type
  isValidResumeFile(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    return allowedTypes.includes(file.type);
  },

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Parse skills string to array
  parseSkills(skillsString: string): string[] {
    return skillsString
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  },

  // Format skills array to string
  formatSkills(skills: string[]): string {
    return skills.join(', ');
  },
};