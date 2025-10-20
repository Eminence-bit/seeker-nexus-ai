import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, Briefcase, DollarSign, Clock, Building, Calendar,
  Bookmark, Share2, ArrowLeft 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobDetails {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  skills_required: string[];
  benefits: string[];
  created_at: string;
  employer_profiles: {
    company_name: string;
    company_logo: string | null;
    company_website: string | null;
    description: string | null;
  };
}

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          employer_profiles (
            company_name,
            company_logo,
            company_website,
            description
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate("/auth?mode=signup");
      return;
    }

    setApplying(true);
    try {
      // Get user's job seeker profile
      const { data: profile } = await supabase
        .from("job_seeker_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        toast({
          title: "Profile Required",
          description: "Please complete your profile before applying",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Submit application
      const { error } = await supabase
        .from("applications")
        .insert({
          job_id: id,
          job_seeker_id: profile.id,
          cover_letter: coverLetter,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your application has been sent successfully",
      });
      
      setShowApplication(false);
      setCoverLetter("");
    } catch (error: any) {
      if (error.code === "23505") {
        toast({
          title: "Already Applied",
          description: "You have already applied to this job",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit application",
          variant: "destructive",
        });
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      
      <div className="container py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/jobs")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  {job.employer_profiles.company_logo && (
                    <img
                      src={job.employer_profiles.company_logo}
                      alt={job.employer_profiles.company_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                      <span className="font-medium">{job.employer_profiles.company_name}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">{job.job_type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</Badge>
                  <Badge variant="outline">{job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)}</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-muted-foreground">{job.requirements}</p>
              </CardContent>
            </Card>

            {job.skills_required && job.skills_required.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {!showApplication ? (
                  <>
                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => setShowApplication(true)}
                    >
                      Apply Now
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        placeholder="Tell the employer why you're a great fit..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={handleApply}
                      disabled={applying}
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowApplication(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">
                      {job.salary_min && job.salary_max
                        ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                        : "Competitive"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Job Type</p>
                    <p className="text-sm text-muted-foreground">
                      {job.job_type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Experience Level</p>
                    <p className="text-sm text-muted-foreground">
                      {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Posted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {job.employer_profiles.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About {job.employer_profiles.company_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {job.employer_profiles.description}
                  </p>
                  {job.employer_profiles.company_website && (
                    <a
                      href={job.employer_profiles.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                    >
                      <Building className="h-4 w-4" />
                      Visit Company Website
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
