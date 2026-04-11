import type {
  CandidateRecord,
  InterviewRecord,
  MessageRecord,
  OfferRecord,
  RecruiterShortlistRecord,
} from "@/lib/recruiter-types";

export const defaultRecruiterId = "recruiter_demo";
export const defaultRecruiterCompany = "TechNova Hiring";

export const defaultCandidates: CandidateRecord[] = [
  {
    id: "cand_aarav",
    name: "Aarav Mehta",
    branch: "Computer Science",
    cgpa: 8.9,
    skills: ["Java", "C++", "React", "Next.js", "Node.js", "MongoDB", "AWS"],
    dsaScore: 88,
    portfolioScore: 84,
    availability: true,
    email: "aarav.mehta@hireups.demo",
    graduationYear: 2026,
    headline: "Full-stack builder with strong DSA consistency and product shipping experience.",
  },
  {
    id: "cand_riya",
    name: "Riya Sharma",
    branch: "Information Technology",
    cgpa: 9.3,
    skills: ["Python", "SQL", "Power BI", "Pandas", "Machine Learning", "Excel"],
    dsaScore: 76,
    portfolioScore: 86,
    availability: true,
    email: "riya.sharma@hireups.demo",
    graduationYear: 2026,
    headline: "Analytics-focused candidate with polished dashboards and strong academic profile.",
  },
  {
    id: "cand_kabir",
    name: "Kabir Nair",
    branch: "Electronics and Communication",
    cgpa: 8.1,
    skills: ["C++", "Embedded C", "Python", "Linux", "Git", "System Design"],
    dsaScore: 81,
    portfolioScore: 73,
    availability: false,
    email: "kabir.nair@hireups.demo",
    graduationYear: 2025,
    headline: "Systems-oriented engineer comfortable with performance and low-level debugging.",
  },
  {
    id: "cand_sana",
    name: "Sana Khan",
    branch: "Computer Science",
    cgpa: 8.7,
    skills: ["JavaScript", "TypeScript", "React", "Tailwind CSS", "Figma", "Firebase"],
    dsaScore: 72,
    portfolioScore: 91,
    availability: true,
    email: "sana.khan@hireups.demo",
    graduationYear: 2026,
    headline: "Frontend-heavy candidate with standout portfolio craft and polished UX execution.",
  },
  {
    id: "cand_vikram",
    name: "Vikram Patel",
    branch: "Mechanical Engineering",
    cgpa: 7.8,
    skills: ["Python", "Java", "Spring Boot", "MySQL", "Docker", "REST APIs"],
    dsaScore: 79,
    portfolioScore: 75,
    availability: true,
    email: "vikram.patel@hireups.demo",
    graduationYear: 2026,
    headline: "Backend-focused switcher with solid API work and improving problem-solving depth.",
  },
  {
    id: "cand_ananya",
    name: "Ananya Mukherjee",
    branch: "Data Science",
    cgpa: 9.1,
    skills: ["Python", "PyTorch", "SQL", "Machine Learning", "NLP", "FastAPI"],
    dsaScore: 80,
    portfolioScore: 89,
    availability: true,
    email: "ananya.mukherjee@hireups.demo",
    graduationYear: 2026,
    headline: "Applied AI candidate with strong case studies and production-minded ML APIs.",
  },
  {
    id: "cand_rohan",
    name: "Rohan Iyer",
    branch: "Computer Science",
    cgpa: 8.5,
    skills: ["Go", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
    dsaScore: 90,
    portfolioScore: 82,
    availability: true,
    email: "rohan.iyer@hireups.demo",
    graduationYear: 2025,
    headline: "Backend systems candidate with strong scaling instincts and clean infrastructure work.",
  },
  {
    id: "cand_meera",
    name: "Meera Joshi",
    branch: "Information Technology",
    cgpa: 8.8,
    skills: ["Java", "Spring Boot", "React", "SQL", "Azure", "Testing"],
    dsaScore: 85,
    portfolioScore: 80,
    availability: true,
    email: "meera.joshi@hireups.demo",
    graduationYear: 2026,
    headline: "Balanced full-stack candidate with dependable execution across product and testing.",
  },
];

export const defaultShortlists: RecruiterShortlistRecord[] = [
  {
    id: "shortlist_demo",
    recruiterId: defaultRecruiterId,
    candidateIds: ["cand_aarav", "cand_rohan", "cand_ananya"],
    createdAt: "2026-04-05T10:00:00.000Z",
  },
];

export const defaultMessages: MessageRecord[] = [
  {
    id: "msg_1",
    senderId: defaultRecruiterId,
    receiverId: "cand_aarav",
    message:
      "Hi Aarav, your full-stack experience looks strong. We would like to invite you for an interview round this week.",
    timestamp: "2026-04-04T11:30:00.000Z",
  },
  {
    id: "msg_2",
    senderId: "cand_aarav",
    receiverId: defaultRecruiterId,
    message: "Thank you. I am available on Wednesday and Friday afternoon.",
    timestamp: "2026-04-04T12:10:00.000Z",
  },
  {
    id: "msg_3",
    senderId: defaultRecruiterId,
    receiverId: "cand_ananya",
    message:
      "Hi Ananya, we liked the ML API projects in your portfolio. Are you open to a machine learning engineer interview?",
    timestamp: "2026-04-06T09:00:00.000Z",
  },
];

export const defaultInterviews: InterviewRecord[] = [
  {
    id: "int_1",
    candidateId: "cand_aarav",
    recruiterId: defaultRecruiterId,
    date: "2026-04-15T14:00:00.000Z",
    status: "scheduled",
  },
  {
    id: "int_2",
    candidateId: "cand_rohan",
    recruiterId: defaultRecruiterId,
    date: "2026-04-09T10:30:00.000Z",
    status: "completed",
  },
];

export const defaultOffers: OfferRecord[] = [
  {
    id: "offer_1",
    candidateId: "cand_rohan",
    company: defaultRecruiterCompany,
    salary: 18,
    status: "accepted",
    deadline: "2026-04-01T18:00:00.000Z",
  },
  {
    id: "offer_2",
    candidateId: "cand_sana",
    company: defaultRecruiterCompany,
    salary: 14,
    status: "issued",
    deadline: "2026-04-13T18:00:00.000Z",
  },
  {
    id: "offer_3",
    candidateId: "cand_meera",
    company: defaultRecruiterCompany,
    salary: 16,
    status: "rejected",
    deadline: "2026-04-07T18:00:00.000Z",
  },
];
