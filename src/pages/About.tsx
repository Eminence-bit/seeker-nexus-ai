import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Users, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionizing Job Search with{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              AI Technology
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            AI JobPortal is the next-generation job matching platform that uses artificial intelligence 
            to connect the right talent with the right opportunities, making career growth accessible to everyone.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To democratize access to career opportunities by leveraging AI to eliminate bias, 
                reduce friction in the hiring process, and help every professional reach their full potential. 
                We believe that finding the right job shouldn't be a matter of luck or connections, 
                but of matching skills and ambitions with the right opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Our Technology</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our AI-powered platform analyzes thousands of data points including skills, experience, 
                career trajectories, and company culture to make intelligent matches. Our machine learning 
                models continuously improve, learning from successful placements to provide even better 
                recommendations over time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">People First</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize human potential over algorithms. Our AI enhances, not replaces, 
                  the human element in career development.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent/80 mx-auto flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in open communication about how our AI works and what data we use, 
                  putting control in the hands of our users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-primary mx-auto flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Continuous Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  We're committed to staying at the forefront of AI technology to deliver 
                  the best possible experience for both job seekers and employers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-br from-primary via-secondary to-accent text-white">
          <CardContent className="py-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">10,000+</p>
                <p className="text-white/90">Jobs Posted</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">50,000+</p>
                <p className="text-white/90">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">95%</p>
                <p className="text-white/90">Match Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
