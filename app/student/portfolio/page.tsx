import type { Metadata } from "next";
import PortfolioGeneratorClient from "./PortfolioGeneratorClient";

export const metadata: Metadata = {
  title: "AI Portfolio Generator | HireUps",
  description: "Generate an ATS-optimized student portfolio in under 60 seconds.",
};

export default function StudentPortfolioPage() {
  return <PortfolioGeneratorClient />;
}