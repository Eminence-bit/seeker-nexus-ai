import Navbar from "@/components/Navbar";
import JobPostingForm from "@/components/JobPostingForm";

const PostJob = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background">
      <Navbar />
      <JobPostingForm />
    </div>
  );
};

export default PostJob;