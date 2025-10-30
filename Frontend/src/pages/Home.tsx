import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Search, Briefcase, TrendingUp, Users, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-job-portal.jpg";
import aiAssistantIcon from "@/assets/ai-assistant-icon.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered Job Matching
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Find Your Dream Job with{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  AI Intelligence
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Let artificial intelligence match you with opportunities that align with your skills, 
                experience, and career goals. The future of job hunting is here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/jobs" className="flex-1 sm:flex-initial">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Explore Jobs
                  </Button>
                </Link>
                <Link to="/auth?mode=signup" className="flex-1 sm:flex-initial">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="AI-powered job portal"
                className="relative rounded-3xl shadow-[var(--shadow-elegant)] w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose AI JobPortal?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI technology combined with human-centric design to revolutionize your job search
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-2 border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Smart Job Matching</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your profile and matches you with the most relevant opportunities based on 
                skills, experience, and preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-2 border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Career Insights</h3>
              <p className="text-muted-foreground">
                Get personalized career advice and market insights powered by AI to make informed decisions 
                about your professional growth.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:-translate-y-2 border-2">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Direct Connections</h3>
              <p className="text-muted-foreground">
                Connect directly with employers and recruiters. No middlemen, no delays. 
                Just straightforward opportunities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Resume Screening CTA */}
      <section className="container py-20">
        <Card className="overflow-hidden border-2 shadow-[var(--shadow-elegant)]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                AI-Powered Resume Screening
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload resumes and job descriptions to get instant AI analysis with candidate 
                profiles, skill matching, and hiring recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/resume-screening">
                  <Button variant="hero" size="lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Try AI Screening
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="outline" size="lg">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img
                src={aiAssistantIcon}
                alt="AI Resume Screening"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* AI Assistant CTA */}
      <section className="container py-20">
        <Card className="overflow-hidden border-2 shadow-[var(--shadow-elegant)]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Your Personal AI Career Assistant
              </h2>
              <p className="text-lg text-muted-foreground">
                Chat with our intelligent AI assistant to get personalized job recommendations, 
                career advice, and answers to all your job search questions.
              </p>
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Chatting Now
                </Button>
              </Link>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img
                src={aiAssistantIcon}
                alt="AI Assistant"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <Card className="bg-gradient-to-br from-primary via-secondary to-accent p-12 text-center text-white shadow-[var(--shadow-elegant)]">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-white/90">
              Join thousands of professionals who have found their dream jobs through AI JobPortal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary to-secondary p-2">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">AI JobPortal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting talent with opportunity through the power of AI
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Create Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth?mode=signup" className="hover:text-primary transition-colors">Post a Job</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">Employer Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2025 AI JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
