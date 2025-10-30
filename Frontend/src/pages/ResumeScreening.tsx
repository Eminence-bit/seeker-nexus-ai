import Navbar from "@/components/Navbar";
import ResumeScreening from "@/components/ResumeScreening";

const ResumeScreeningPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      <ResumeScreening />
    </div>
  );
};

export default ResumeScreeningPage;