import type { Metadata } from "next";

import { RecruiterOffersView } from "@/components/recruiter/RecruiterViews";

export const metadata: Metadata = {
  title: "Recruiter Offers | HireUps",
  description: "Issue offers, monitor deadlines, and track candidate acceptance status.",
};

export default function RecruiterOffersPage() {
  return <RecruiterOffersView />;
}
