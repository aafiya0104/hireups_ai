import type { Metadata } from "next";

import { RecruiterEngagementView } from "@/components/recruiter/RecruiterViews";

export const metadata: Metadata = {
  title: "Recruiter Engagement | HireUps",
  description: "Message candidates, generate invite drafts, and schedule interviews.",
};

export default function RecruiterEngagementPage() {
  return <RecruiterEngagementView />;
}
