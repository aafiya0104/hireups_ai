import type {
  AlumniRecord,
  CompanyInput,
  DriveRecord,
  OutreachRecord,
  PlacementStatsRecord,
} from "@/lib/tpo-types";

export const defaultCompanies: CompanyInput[] = [
  {
    name: "TechNova Solutions",
    roles: ["SDE", "Frontend Developer", "Backend Developer"],
    avgSalary: 12,
    hiringFrequency: 86,
    tierMatch: 78,
  },
  {
    name: "FinServe Global",
    roles: ["Analyst", "Data Engineer", "Software Engineer"],
    avgSalary: 10,
    hiringFrequency: 74,
    tierMatch: 72,
  },
  {
    name: "CloudScale Inc",
    roles: ["DevOps Engineer", "Platform Engineer", "SRE"],
    avgSalary: 14,
    hiringFrequency: 68,
    tierMatch: 80,
  },
  {
    name: "PixelForge Labs",
    roles: ["UI Engineer", "Full Stack Developer"],
    avgSalary: 9,
    hiringFrequency: 62,
    tierMatch: 70,
  },
  {
    name: "Astra Mobility",
    roles: ["Embedded Engineer", "QA Engineer", "Software Engineer"],
    avgSalary: 8,
    hiringFrequency: 58,
    tierMatch: 65,
  },
];

export const defaultAlumni: AlumniRecord[] = [
  {
    id: "alumni_1",
    name: "Rahul Verma",
    company: "Amazon",
    role: "SDE-2",
    seniority: "Senior",
    techStack: ["React", "Node.js", "AWS"],
    isActive: true,
  },
  {
    id: "alumni_2",
    name: "Priya Sharma",
    company: "Google",
    role: "Engineering Manager",
    seniority: "Lead",
    techStack: ["Go", "GCP", "Distributed Systems"],
    isActive: true,
  },
  {
    id: "alumni_3",
    name: "Ankit Rao",
    company: "Microsoft",
    role: "Software Engineer",
    seniority: "Mid",
    techStack: ["C#", ".NET", "Azure"],
    isActive: false,
  },
  {
    id: "alumni_4",
    name: "Sneha Kulkarni",
    company: "Infosys",
    role: "Technology Analyst",
    seniority: "Mid",
    techStack: ["Java", "Spring Boot", "SQL"],
    isActive: true,
  },
  {
    id: "alumni_5",
    name: "Mohit Bansal",
    company: "Adobe",
    role: "Computer Scientist",
    seniority: "Senior",
    techStack: ["JavaScript", "TypeScript", "Microservices"],
    isActive: false,
  },
];

export const defaultOutreach: OutreachRecord[] = [
  {
    id: "outreach_1",
    recipientName: "Priya Sharma",
    company: "Google",
    message:
      "Hello Priya, we would like to connect with you to explore mentorship and placement opportunities for our upcoming hiring cycle.",
    status: "replied",
    createdAt: new Date("2026-03-12T10:15:00.000Z").toISOString(),
    approved: true,
  },
  {
    id: "outreach_2",
    recipientName: "Rahul Verma",
    company: "Amazon",
    message:
      "Hello Rahul, we would like to reconnect regarding hiring outreach and student engagement opportunities for the next placement season.",
    status: "delivered",
    createdAt: new Date("2026-03-19T08:20:00.000Z").toISOString(),
    approved: false,
  },
];

export const defaultPlacementStats: PlacementStatsRecord = {
  id: "stats_1",
  totalOffers: 342,
  avgCTC: 8.4,
  placementRate: 78,
  unplaced: 96,
};

export const defaultDrives: DriveRecord[] = [
  {
    id: "drive_1",
    year: 2023,
    companies: 34,
    roles: 52,
    salary: 7.2,
    selectionRate: 31,
  },
  {
    id: "drive_2",
    year: 2024,
    companies: 41,
    roles: 64,
    salary: 8.1,
    selectionRate: 36,
  },
  {
    id: "drive_3",
    year: 2025,
    companies: 45,
    roles: 71,
    salary: 8.8,
    selectionRate: 39,
  },
];
