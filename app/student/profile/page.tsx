import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";

export const metadata: Metadata = {
  title: "Student Profile | HireUps",
  description: "Editable student profile for HireUps placement intelligence.",
};

export default function StudentProfilePage() {
  return <ProfilePageClient />;
}