import type { Metadata } from "next";

import { RecruiterCandidatesView } from "@/components/recruiter/RecruiterViews";

export const metadata: Metadata = {
  title: "Recruiter Candidates | HireUps",
  description: "Discover and compare candidates with Groq-assisted ranking and filters.",
};

export default function RecruiterCandidatesPage() {
  return <RecruiterCandidatesView />;
}
