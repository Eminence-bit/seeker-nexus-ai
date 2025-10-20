import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Briefcase, FileText, MessageSquare, Settings, 
  MapPin, Clock, TrendingUp 
} from "lucide-react";

interface JobSeekerDashboardProps {
  userId: string;
}

const JobSeekerDashboard = ({ userId }: JobSeekerDashboardProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Get job seeker profile
      const { data: profileData, error: profileError } = await supabase
        .from("job_seeker_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (!profileData) {
        // Create initial profile
        const { data: newProfile, error: createError } = await supabase
          .from("job_seeker_profiles")
          .insert({ user_id: userId })
          .select()
          .single();
        
        if (createError) throw createError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }

      // Get applications if profile exists
      if (profileData) {
        const { data: appsData, error: appsError } = await supabase
          .from("applications")
          .select(`
            *,
            jobs (
              id,
              title,
              location,
              job_type,
              employer_profiles (
                company_name,
                company_logo
              )
            )
          `)
          .eq("job_seeker_id", profileData.id)
          .order("created_at", { ascending: false });

        if (appsError) throw appsError;
        setApplications(appsData || []);

        // Get saved jobs
        const { data: savedData, error: savedError } = await supabase
          .from("saved_jobs")
          .select(`
            *,
            jobs (
              id,
              title,
              location,
              job_type,
              salary_min,
              salary_max,
              employer_profiles (
                company_name
              )
            )
          `)
          .eq("job_seeker_id", profileData.id)
          .order("created_at", { ascending: false });

        if (savedError) throw savedError;
        setSavedJobs(savedData || []);
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-lg text-muted-foreground">
          Track your applications and discover new opportunities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedJobs.length}</p>
                <p className="text-sm text-muted-foreground">Saved Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {applications.filter(a => a.status === 'interview' || a.status === 'offered').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-center">
            <Link to="/chat" className="w-full">
              <Button variant="hero" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Career Coach
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No applications yet</p>
                <p className="text-muted-foreground mb-4">
                  Start applying to jobs to see them here
                </p>
                <Link to="/jobs">
                  <Button variant="hero">Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {app.jobs.employer_profiles.company_logo && (
                        <img
                          src={app.jobs.employer_profiles.company_logo}
                          alt={app.jobs.employer_profiles.company_name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <Link to={`/jobs/${app.jobs.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                            {app.jobs.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {app.jobs.employer_profiles.company_name}
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {app.jobs.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Applied {new Date(app.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">No saved jobs</p>
                <p className="text-muted-foreground mb-4">
                  Save jobs you're interested in to view them later
                </p>
                <Link to="/jobs">
                  <Button variant="hero">Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            savedJobs.map((saved) => (
              <Card key={saved.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <Link to={`/jobs/${saved.jobs.id}`}>
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">
                      {saved.jobs.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">
                    {saved.jobs.employer_profiles.company_name}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {saved.jobs.location}
                    </span>
                    {saved.jobs.salary_min && saved.jobs.salary_max && (
                      <span>
                        ${(saved.jobs.salary_min / 1000).toFixed(0)}k - $
                        {(saved.jobs.salary_max / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Complete your profile to get better job matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Experience</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.experience_years 
                    ? `${profile.experience_years} years` 
                    : "Not specified"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Desired Salary</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.desired_salary_min && profile?.desired_salary_max
                    ? `$${(profile.desired_salary_min / 1000).toFixed(0)}k - $${(profile.desired_salary_max / 1000).toFixed(0)}k`
                    : "Not specified"}
                </p>
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSeekerDashboard;
