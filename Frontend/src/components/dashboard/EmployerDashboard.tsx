import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, Users, Eye, Plus, Brain,
  MapPin, Clock, DollarSign 
} from "lucide-react";

interface EmployerDashboardProps {
  userId: string;
}

const EmployerDashboard = ({ userId }: EmployerDashboardProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Get employer profile
      const { data: profileData, error: profileError } = await supabase
        .from("employer_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profileData) {
        // Create initial profile
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", userId)
          .single();

        const { data: newProfile, error: createError } = await supabase
          .from("employer_profiles")
          .insert({ 
            user_id: userId,
            company_name: userProfile?.full_name || "My Company"
          })
          .select()
          .single();
        
        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);

        // Get jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .eq("employer_id", profileData.id)
          .order("created_at", { ascending: false });

        if (jobsError) throw jobsError;
        setJobs(jobsData || []);

        // Get all applications for employer's jobs
        if (jobsData && jobsData.length > 0) {
          const jobIds = jobsData.map(job => job.id);
          const { data: appsData, error: appsError } = await supabase
            .from("applications")
            .select(`
              *,
              job_seeker_profiles (
                user_id,
                skills,
                experience_years,
                profiles (
                  full_name,
                  email
                )
              ),
              jobs (
                title
              )
            `)
            .in("job_id", jobIds)
            .order("created_at", { ascending: false });

          if (appsError) throw appsError;
          setApplications(appsData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      reviewing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      interview: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      offered: "bg-green-500/10 text-green-500 border-green-500/20",
      rejected: "bg-red-500/10 text-red-500 border-red-500/20",
      accepted: "bg-green-600/10 text-green-600 border-green-600/20",
    };
    return colors[status] || "";
  };

  const totalViews = jobs.reduce((sum, job) => sum + (job.views_count || 0), 0);
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {profile?.company_name || "Your Company"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your job postings and review applicants
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/resume-screening">
            <Button variant="outline" size="lg">
              <Brain className="mr-2 h-5 w-5" />
              AI Screening
            </Button>
          </Link>
          <Button variant="hero" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalApplications}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">New</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No jobs posted yet</p>
                <p className="text-muted-foreground mb-4">
                  Create your first job posting to start receiving applications
                </p>
                <Button variant="hero">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your First Job
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge variant={job.is_active ? "default" : "secondary"}>
                          {job.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-6 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {job.views_count} views
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {job.applications_count} applications
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/jobs/${job.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No applications yet</p>
                <p className="text-muted-foreground">
                  Applications will appear here once candidates apply to your jobs
                </p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {app.job_seeker_profiles.profiles.full_name}
                        </h3>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Applied for: <span className="font-medium">{app.jobs.title}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {app.job_seeker_profiles.profiles.email}
                      </p>

                      {app.job_seeker_profiles.skills && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {app.job_seeker_profiles.skills.slice(0, 5).map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {app.job_seeker_profiles.experience_years && (
                          <span>{app.job_seeker_profiles.experience_years} years experience</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>

                  {app.cover_letter && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Cover Letter:</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {app.cover_letter}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Your company information visible to job seekers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Company Name</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.company_name || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Industry</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.industry || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Company Size</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.company_size || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Website</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.company_website || "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.description || "No description added"}
                </p>
              </div>

              <Button variant="outline" className="w-full">
                Edit Company Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerDashboard;
