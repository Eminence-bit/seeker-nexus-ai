import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import JobSeekerDashboard from "@/components/dashboard/JobSeekerDashboard";
import EmployerDashboard from "@/components/dashboard/EmployerDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUserAndRole();
  }, []);

  const checkUserAndRole = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);

      // Get user profile to determine role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      if (!profile) {
        toast({
          title: "Profile Not Found",
          description: "Please complete your profile setup",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setUserRole(profile.role);
    } catch (error) {
      console.error("Error checking user role:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      {userRole === "job_seeker" ? (
        <JobSeekerDashboard userId={userId!} />
      ) : userRole === "employer" ? (
        <EmployerDashboard userId={userId!} />
      ) : (
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Invalid user role</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
