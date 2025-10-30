import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api, utils, type ScreeningResponse } from "@/lib/api";
import BackendStatus from "./BackendStatus";
import { 
  Upload, FileText, Brain, CheckCircle, XCircle, 
  AlertCircle, User, Mail, Phone, GraduationCap,
  Award, Briefcase, TrendingUp, ThumbsUp, ThumbsDown
} from "lucide-react";

const ResumeScreening = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreeningResponse | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    requiredSkills: "",
    preferredSkills: "",
    experienceRequired: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!utils.isValidResumeFile(file)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a resume file to screen",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobTitle || !formData.jobDescription || !formData.requiredSkills) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await api.screenResume(
        selectedFile,
        formData.jobTitle,
        formData.jobDescription,
        formData.requiredSkills,
        formData.preferredSkills || undefined,
        formData.experienceRequired || undefined
      );
      
      setResult(data);
      
      toast({
        title: "Resume Screened Successfully",
        description: "AI analysis completed",
      });
    } catch (error) {
      console.error('Error screening resume:', error);
      toast({
        title: "Screening Failed",
        description: error instanceof Error ? error.message : "An error occurred while screening the resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'hire':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'interview':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'reject':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'hire':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'interview':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'reject':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Resume Screening</h1>
            <p className="text-lg text-muted-foreground">
              Upload a resume and job description to get AI-powered candidate evaluation
            </p>
          </div>
          <BackendStatus />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Resume Screening Setup
            </CardTitle>
            <CardDescription>
              Provide job details and upload a resume for AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="resume">Resume File *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload resume
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, or DOCX files only
                    </p>
                  </label>
                  {selectedFile && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-primary">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description *</Label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                  placeholder="Detailed job description including responsibilities and requirements..."
                  rows={4}
                />
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <Label htmlFor="requiredSkills">Required Skills *</Label>
                <Input
                  id="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiredSkills: e.target.value }))}
                  placeholder="Python, React, Node.js, AWS (comma-separated)"
                />
              </div>

              {/* Preferred Skills */}
              <div className="space-y-2">
                <Label htmlFor="preferredSkills">Preferred Skills</Label>
                <Input
                  id="preferredSkills"
                  value={formData.preferredSkills}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredSkills: e.target.value }))}
                  placeholder="Docker, Kubernetes, GraphQL (comma-separated)"
                />
              </div>

              {/* Experience Required */}
              <div className="space-y-2">
                <Label htmlFor="experienceRequired">Years of Experience Required</Label>
                <Input
                  id="experienceRequired"
                  type="number"
                  value={formData.experienceRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceRequired: e.target.value }))}
                  placeholder="5"
                  min="0"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
                variant="hero"
              >
                {loading ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Screen Resume
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
                  <p className="text-lg font-medium mb-2">AI Analysis in Progress</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our AI is analyzing the resume against your job requirements...
                  </p>
                  <Progress value={33} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Decision Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getRecommendationIcon(result.decision.recommendation)}
                    AI Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getRecommendationColor(result.decision.recommendation)}>
                      {result.decision.recommendation.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{result.decision.confidence_score.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Skills Match</p>
                      <div className="flex items-center gap-2">
                        <Progress value={result.decision.skill_match_percentage} className="flex-1" />
                        <span className="text-sm font-medium">{result.decision.skill_match_percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Experience Match</p>
                      <p className="text-sm text-muted-foreground">{result.decision.experience_match}</p>
                    </div>
                  </div>

                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Summary</p>
                    <p className="text-sm text-muted-foreground">{result.decision.summary}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Candidate Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Candidate Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{result.candidate_profile.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                        {result.candidate_profile.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {result.candidate_profile.email}
                          </span>
                        )}
                        {result.candidate_profile.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {result.candidate_profile.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{result.candidate_profile.summary}</p>
                    </div>

                    {result.candidate_profile.years_of_experience && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{result.candidate_profile.years_of_experience} years of experience</span>
                      </div>
                    )}

                    {result.candidate_profile.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {result.candidate_profile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.candidate_profile.education.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          Education
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.candidate_profile.education.map((edu, index) => (
                            <li key={index}>• {edu}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.candidate_profile.certifications.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          Certifications
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {result.candidate_profile.certifications.map((cert, index) => (
                            <li key={index}>• {cert}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Advantages & Disadvantages */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <ThumbsUp className="h-5 w-5" />
                      Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.decision.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <ThumbsDown className="h-5 w-5" />
                      Areas of Concern
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.decision.disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          {disadvantage}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScreening;