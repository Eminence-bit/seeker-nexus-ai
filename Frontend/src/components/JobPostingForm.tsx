import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { 
  Briefcase, MapPin, DollarSign, Clock, Users, 
  Plus, X, Save, Eye, Brain
} from "lucide-react";

interface JobPostingFormProps {
  jobId?: string;
  onSuccess?: () => void;
}

interface JobFormData {
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: string;
  salary_max: string;
  skills_required: string[];
  benefits: string[];
  requirements: string;
  is_active: boolean;
}

const JobPostingForm = ({ jobId, onSuccess }: JobPostingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [employerProfile, setEmployerProfile] = useState<any>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    location: "",
    job_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    skills_required: [],
    benefits: [],
    requirements: "",
    is_active: true,
  });

  useEffect(() => {
    checkEmployerProfile();
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  const checkEmployerProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("employer_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setEmployerProfile(profile);
    } catch (error) {
      console.error("Error checking employer profile:", error);
      toast({
        title: "Error",
        description: "Failed to load employer profile",
        variant: "destructive",
      });
    }
  };

  const loadJobData = async () => {
    if (!jobId) return;

    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        job_type: data.job_type || "",
        experience_level: data.experience_level || "",
        salary_min: data.salary_min?.toString() || "",
        salary_max: data.salary_max?.toString() || "",
        skills_required: data.skills_required || [],
        benefits: data.benefits || [],
        requirements: data.requirements || "",
        is_active: data.is_active !== false,
      });
    } catch (error) {
      console.error("Error loading job data:", error);
      toast({
        title: "Error",
        description: "Failed to load job data",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    const currentSkills = formData.skills_required;
    
    if (!currentSkills.includes(newSkill.trim())) {
      handleInputChange('skills_required', [...currentSkills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = formData.skills_required;
    handleInputChange('skills_required', currentSkills.filter(skill => skill !== skillToRemove));
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    
    if (!formData.benefits.includes(newBenefit.trim())) {
      handleInputChange('benefits', [...formData.benefits, newBenefit.trim()]);
    }
    setNewBenefit("");
  };

  const removeBenefit = (benefitToRemove: string) => {
    handleInputChange('benefits', formData.benefits.filter(benefit => benefit !== benefitToRemove));
  };

  const validateForm = () => {
    const required = ['title', 'description', 'location', 'job_type', 'experience_level'];
    const missing = required.filter(field => !formData[field as keyof JobFormData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    if (formData.skills_required.length === 0) {
      toast({
        title: "Missing Skills",
        description: "Please add at least one required skill",
        variant: "destructive",
      });
      return false;
    }

    if (formData.salary_min && formData.salary_max) {
      const min = parseInt(formData.salary_min);
      const max = parseInt(formData.salary_max);
      if (min >= max) {
        toast({
          title: "Invalid Salary Range",
          description: "Maximum salary must be greater than minimum salary",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !employerProfile) return;

    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        job_type: formData.job_type as Database["public"]["Enums"]["job_type"],
        experience_level: formData.experience_level as Database["public"]["Enums"]["experience_level"],
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        skills_required: formData.skills_required,
        benefits: formData.benefits,
        requirements: formData.requirements,
        is_active: formData.is_active,
        employer_id: employerProfile.id,
      };

      let result;
      if (jobId) {
        // Update existing job
        result = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", jobId)
          .select()
          .single();
      } else {
        // Create new job
        result = await supabase
          .from("jobs")
          .insert(jobData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: jobId ? "Job Updated" : "Job Posted",
        description: jobId ? "Job posting has been updated successfully" : "Your job posting is now live",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: "Failed to save job posting",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Navigate to a preview page or open a modal
    toast({
      title: "Preview",
      description: "Preview functionality coming soon",
    });
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {jobId ? "Edit Job Posting" : "Post a New Job"}
        </h1>
        <p className="text-lg text-muted-foreground">
          {jobId ? "Update your job posting details" : "Create a compelling job posting to attract top talent"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential details about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type *</Label>
                <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level *</Label>
                <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>


            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of the role, what the candidate will be doing, and what makes this opportunity exciting..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Compensation
            </CardTitle>
            <CardDescription>
              Salary range and benefits information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Minimum Salary (Annual)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => handleInputChange('salary_min', e.target.value)}
                  placeholder="e.g., 80000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary_max">Maximum Salary (Annual)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => handleInputChange('salary_max', e.target.value)}
                  placeholder="e.g., 120000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Benefits & Perks</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit (e.g., Health Insurance)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {benefit}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeBenefit(benefit)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skills & Requirements
            </CardTitle>
            <CardDescription>
              Define the skills and qualifications needed for this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Required Skills *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a required skill (e.g., React)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills_required.map((skill, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements & Qualifications</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the education, experience, and other requirements for this role..."
                  rows={6}
                />
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is_active">Publish immediately</Label>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button type="submit" disabled={loading} variant="hero">
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  {jobId ? "Updating..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {jobId ? "Update Job" : "Post Job"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;