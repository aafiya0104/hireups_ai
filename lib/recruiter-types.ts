export type ApiMeta = {
  source: "database" | "fallback";
  fallbackUsed: boolean;
  message?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta: ApiMeta;
  error?: string | null;
};

export type CandidateRecord = {
  id: string;
  name: string;
  branch: string;
  cgpa: number;
  skills: string[];
  dsaScore: number;
  portfolioScore: number;
  availability: boolean;
  email?: string;
  graduationYear?: number;
  headline?: string;
};

export type CandidateFilters = {
  skills?: string[];
  minCgpa?: number;
  branch?: string;
  minDsaScore?: number;
  minPortfolioScore?: number;
  availability?: boolean;
};

export type RankedCandidate = CandidateRecord & {
  score: number;
  qualityScore: number;
  matchedSkills: string[];
  reasons: string[];
};

export type DiscoverPayload = {
  aiUsed: boolean;
  insights: {
    requiredSkills: string[];
    experienceLevel: string;
    hiringSignals: string[];
  };
  candidates: RankedCandidate[];
};

export type RecruiterShortlistRecord = {
  id: string;
  recruiterId: string;
  candidateIds: string[];
  createdAt: string;
};

export type ShortlistPayload = {
  shortlist: RecruiterShortlistRecord;
  candidates: CandidateRecord[];
};

export type MessageRecord = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
};

export type InterviewStatus = "scheduled" | "completed";

export type InterviewRecord = {
  id: string;
  candidateId: string;
  recruiterId: string;
  date: string;
  status: InterviewStatus;
};

export type OfferStatus = "issued" | "accepted" | "rejected";

export type OfferRecord = {
  id: string;
  candidateId: string;
  company: string;
  salary: number;
  status: OfferStatus;
  deadline: string;
};

export type AnalyticsPayload = {
  kpis: {
    timeToHire: number;
    offerAcceptanceRate: number;
    candidateQualityScore: number;
    activeCandidates: number;
  };
  charts: {
    offersByStatus: Array<{ label: string; value: number }>;
    qualityByBranch: Array<{ label: string; value: number }>;
    hiringTimeline: Array<{ label: string; value: number }>;
  };
  recruiterActivity: Array<{ label: string; detail: string; timestamp: string }>;
};
