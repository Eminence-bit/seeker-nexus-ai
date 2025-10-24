import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  salary_min: number | null;
  salary_max: number | null;
  skills_required: string[];
  created_at: string;
  employer_profiles: {
    company_name: string;
    company_logo: string | null;
  };
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          employer_profiles (
            company_name,
            company_logo
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employer_profiles.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Competitive";
    if (min && max) return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    if (min) return `From $${(min / 1000).toFixed(0)}k`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return "Competitive";
  };

  const formatJobType = (type: string) => {
    return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const days = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Find Your Next Opportunity</h1>
          <p className="text-lg text-muted-foreground">
            Discover jobs that match your skills and ambitions
          </p>
          
          {/* Search Bar */}
          <div className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="hero">
              Search
            </Button>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Link key={job.id} to={`/jobs/${job.id}`}>
                <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:border-primary cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        {job.employer_profiles.company_logo && (
                          <img
                            src={job.employer_profiles.company_logo}
                            alt={job.employer_profiles.company_name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 space-y-1">
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {job.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="font-medium">{job.employer_profiles.company_name}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary">{formatJobType(job.job_type)}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(job.created_at)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {job.experience_level.charAt(0).toUpperCase() + job.experience_level.slice(1)}
                      </div>
                    </div>
                    {job.skills_required && job.skills_required.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.skills_required.slice(0, 5).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills_required.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills_required.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
