import type { Metadata } from "next";

import { RecruiterDashboardView } from "@/components/recruiter/RecruiterViews";

export const metadata: Metadata = {
  title: "Recruiter Dashboard | HireUps",
  description: "Live recruiter analytics, pipeline tracking, and admin controls for HireUps.",
};

export default function RecruiterDashboardPage() {
  return <RecruiterDashboardView />;
}
