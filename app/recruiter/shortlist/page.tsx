import type { Metadata } from "next";

import { RecruiterShortlistView } from "@/components/recruiter/RecruiterViews";

export const metadata: Metadata = {
  title: "Recruiter Shortlist | HireUps",
  description: "Review saved recruiter shortlists and compare bookmarked candidates.",
};

export default function RecruiterShortlistPage() {
  return <RecruiterShortlistView />;
}
