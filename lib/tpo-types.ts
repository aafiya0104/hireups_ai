export type OutreachStatus = "sent" | "delivered" | "replied";

export type CompanyInput = {
  id?: string;
  name?: string;
  roles?: string[];
  avgSalary?: number;
  hiringFrequency?: number;
  tierMatch?: number;
  score?: number;
};

export type CompanyRecord = {
  id: string;
  name: string;
  roles: string[];
  avgSalary: number;
  hiringFrequency: number;
  tierMatch: number;
  score: number;
};

export type AlumniRecord = {
  id: string;
  name: string;
  company: string;
  role: string;
  seniority: string;
  techStack: string[];
  isActive: boolean;
};

export type OutreachRecord = {
  id: string;
  recipientName: string;
  company: string;
  message: string;
  status: OutreachStatus;
  createdAt: string;
  approved: boolean;
};

export type PlacementStatsRecord = {
  id: string;
  totalOffers: number;
  avgCTC: number;
  placementRate: number;
  unplaced: number;
};

export type DriveRecord = {
  id: string;
  year: number;
  companies: number;
  roles: number;
  salary: number;
  selectionRate: number;
};

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
