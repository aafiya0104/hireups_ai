import { randomUUID } from "crypto";

import {
  defaultAlumni,
  defaultCompanies,
  defaultDrives,
  defaultOutreach,
  defaultPlacementStats,
} from "@/data/tpoSeed";
import { generateOutreachMessage } from "@/lib/aiService";
import { connectToDatabase } from "@/lib/db";
import type {
  AlumniRecord,
  ApiMeta,
  CompanyInput,
  CompanyRecord,
  DriveRecord,
  OutreachRecord,
  OutreachStatus,
  PlacementStatsRecord,
} from "@/lib/tpo-types";
import { AlumniModel } from "@/models/Alumni";
import { CompanyModel } from "@/models/Company";
import { DriveModel } from "@/models/Drive";
import { OutreachModel } from "@/models/Outreach";
import { PlacementStatsModel } from "@/models/PlacementStats";

type DataSource<T> = {
  data: T;
  meta: ApiMeta;
};

const memoryState: {
  companies: CompanyInput[];
  alumni: AlumniRecord[];
  outreach: OutreachRecord[];
  placementStats: PlacementStatsRecord;
  drives: DriveRecord[];
} = {
  companies: structuredClone(defaultCompanies),
  alumni: structuredClone(defaultAlumni),
  outreach: structuredClone(defaultOutreach),
  placementStats: structuredClone(defaultPlacementStats),
  drives: structuredClone(defaultDrives),
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}

function normalizeSalary(value: number) {
  return clampScore((value / 20) * 100);
}

function normalizeCompanyRecord(company: CompanyInput, role = ""): CompanyRecord {
  const safeRoles = Array.isArray(company.roles) ? company.roles.filter(Boolean) : [];
  const avgSalary = Number(company.avgSalary ?? 0);
  const hiringFrequency = Number(company.hiringFrequency ?? 50);
  const tierMatch = Number(company.tierMatch ?? 50);
  const lowerRole = role.trim().toLowerCase();
  const roleMatch = lowerRole
    ? safeRoles.some((entry) => entry.toLowerCase().includes(lowerRole))
      ? 100
      : safeRoles.length
        ? 35
        : 20
    : clampScore(40 + safeRoles.length * 15);

  const score = clampScore(
    0.4 * hiringFrequency +
      0.3 * roleMatch +
      0.2 * normalizeSalary(avgSalary) +
      0.1 * tierMatch,
  );

  return {
    id: company.id ?? randomUUID(),
    name: company.name?.trim() || "Unknown Company",
    roles: safeRoles,
    avgSalary,
    hiringFrequency,
    tierMatch,
    score,
  };
}

function docToPlain(doc: any) {
  const id = doc?._id != null ? String(doc._id) : randomUUID();

  return {
    ...doc,
    id,
  };
}

function fallbackMeta(message: string): ApiMeta {
  return {
    source: "fallback",
    fallbackUsed: true,
    message,
  };
}

function dbMeta(): ApiMeta {
  return {
    source: "database",
    fallbackUsed: false,
  };
}

async function canUseDatabase() {
  return connectToDatabase();
}

export async function getCompanies(role = ""): Promise<DataSource<CompanyRecord[]>> {
  try {
    if (await canUseDatabase()) {
      const docs = await CompanyModel.find().lean();
      if (docs.length > 0) {
        const companies = docs
          .map((doc) => normalizeCompanyRecord(docToPlain(doc), role))
          .sort((a, b) => b.score - a.score);
        return { data: companies, meta: dbMeta() };
      }
    }
  } catch (error) {
    console.error("Failed to load companies from database.", error);
  }

  const fallbackCompanies = memoryState.companies
    .map((company) => normalizeCompanyRecord(company, role))
    .sort((a, b) => b.score - a.score);

  return {
    data: fallbackCompanies,
    meta: fallbackMeta("Using built-in company dataset."),
  };
}

export async function addCompany(input: CompanyInput): Promise<DataSource<CompanyRecord>> {
  const company = normalizeCompanyRecord(input);

  try {
    if (await canUseDatabase()) {
      const created = await CompanyModel.create(company);
      return {
        data: normalizeCompanyRecord(docToPlain(created.toObject())),
        meta: dbMeta(),
      };
    }
  } catch (error) {
    console.error("Failed to add company to database.", error);
  }

  memoryState.companies.unshift(company);
  return {
    data: company,
    meta: fallbackMeta("Company saved in in-memory fallback store."),
  };
}

export async function updateCompany(
  id: string,
  input: CompanyInput,
): Promise<DataSource<CompanyRecord | null>> {
  try {
    if (await canUseDatabase()) {
      const existing = await CompanyModel.findById(id);
      if (!existing) {
        return { data: null, meta: dbMeta() };
      }

      existing.name = input.name?.trim() || existing.name;
      existing.roles = Array.isArray(input.roles) ? input.roles : existing.roles;
      existing.avgSalary = Number(input.avgSalary ?? existing.avgSalary);
      existing.hiringFrequency = Number(input.hiringFrequency ?? existing.hiringFrequency);
      existing.tierMatch = Number(input.tierMatch ?? existing.tierMatch);
      const normalized = normalizeCompanyRecord(docToPlain(existing.toObject()));
      existing.score = normalized.score;
      await existing.save();

      return {
        data: normalizeCompanyRecord(docToPlain(existing.toObject())),
        meta: dbMeta(),
      };
    }
  } catch (error) {
    console.error("Failed to update company in database.", error);
  }

  const index = memoryState.companies.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return { data: null, meta: fallbackMeta("Company not found in fallback store.") };
  }

  memoryState.companies[index] = {
    ...memoryState.companies[index],
    ...input,
    id,
  };
  const updated = normalizeCompanyRecord(memoryState.companies[index]);
  memoryState.companies[index] = updated;

  return {
    data: updated,
    meta: fallbackMeta("Company updated in in-memory fallback store."),
  };
}

export async function getAlumni(filters: {
  company?: string;
  role?: string;
  search?: string;
}): Promise<DataSource<AlumniRecord[]>> {
  const applyFilters = (records: AlumniRecord[]) => {
    const company = filters.company?.trim().toLowerCase() ?? "";
    const role = filters.role?.trim().toLowerCase() ?? "";
    const search = filters.search?.trim().toLowerCase() ?? "";

    return records.filter((record) => {
      const companyMatch = company ? record.company.toLowerCase().includes(company) : true;
      const roleMatch = role ? record.role.toLowerCase().includes(role) : true;
      const searchMatch = search ? record.name.toLowerCase().includes(search) : true;
      return companyMatch && roleMatch && searchMatch;
    });
  };

  try {
    if (await canUseDatabase()) {
      const docs = await AlumniModel.find().lean();
      if (docs.length > 0) {
        return {
          data: applyFilters(
            docs.map((doc) => {
              const plain = docToPlain(doc);
              return {
                id: plain.id,
                name: plain.name ?? "Unknown Alumni",
                company: plain.company ?? "Unknown Company",
                role: plain.role ?? "Unknown Role",
                seniority: plain.seniority ?? "Mid",
                techStack: Array.isArray(plain.techStack) ? plain.techStack : [],
                isActive: Boolean(plain.isActive),
              };
            }),
          ),
          meta: dbMeta(),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load alumni from database.", error);
  }

  return {
    data: applyFilters(memoryState.alumni),
    meta: fallbackMeta("Using built-in alumni dataset."),
  };
}

export async function addAlumni(
  input: Partial<AlumniRecord>,
): Promise<DataSource<AlumniRecord>> {
  const alumni: AlumniRecord = {
    id: input.id ?? randomUUID(),
    name: input.name?.trim() || "Unnamed Alumni",
    company: input.company?.trim() || "Unknown Company",
    role: input.role?.trim() || "Unknown Role",
    seniority: input.seniority?.trim() || "Mid",
    techStack: Array.isArray(input.techStack) ? input.techStack.filter(Boolean) : [],
    isActive: input.isActive ?? true,
  };

  try {
    if (await canUseDatabase()) {
      const created = await AlumniModel.create(alumni);
      const plain = docToPlain(created.toObject());
      return {
        data: {
          id: plain.id,
          name: plain.name,
          company: plain.company,
          role: plain.role,
          seniority: plain.seniority,
          techStack: plain.techStack,
          isActive: plain.isActive,
        },
        meta: dbMeta(),
      };
    }
  } catch (error) {
    console.error("Failed to add alumni to database.", error);
  }

  memoryState.alumni.unshift(alumni);
  return {
    data: alumni,
    meta: fallbackMeta("Alumni saved in in-memory fallback store."),
  };
}

function getStatusForOutreach(recipient: string, company: string): OutreachStatus {
  const seed = `${recipient}${company}`.length % 3;
  return ["sent", "delivered", "replied"][seed] as OutreachStatus;
}

export async function sendOutreach(input: {
  recipient: string;
  company: string;
}): Promise<DataSource<OutreachRecord>> {
  const recipientName = input.recipient.trim() || "Hiring Contact";
  const company = input.company.trim() || "Unknown Company";
  const message = await generateOutreachMessage(recipientName, company);
  const outreach: OutreachRecord = {
    id: randomUUID(),
    recipientName,
    company,
    message,
    status: getStatusForOutreach(recipientName, company),
    createdAt: new Date().toISOString(),
    approved: false,
  };

  try {
    if (await canUseDatabase()) {
      const created = await OutreachModel.create({
        recipientName: outreach.recipientName,
        company: outreach.company,
        message: outreach.message,
        status: outreach.status,
        createdAt: outreach.createdAt,
        approved: outreach.approved,
      });
      const plain = docToPlain(created.toObject());
      return {
        data: {
          id: plain.id,
          recipientName: plain.recipientName,
          company: plain.company,
          message: plain.message,
          status: plain.status,
          createdAt: new Date(plain.createdAt).toISOString(),
          approved: Boolean(plain.approved),
        },
        meta: dbMeta(),
      };
    }
  } catch (error) {
    console.error("Failed to save outreach in database.", error);
  }

  memoryState.outreach.unshift(outreach);
  return {
    data: outreach,
    meta: fallbackMeta("Outreach stored in in-memory fallback store."),
  };
}

export async function getOutreach(): Promise<DataSource<OutreachRecord[]>> {
  try {
    if (await canUseDatabase()) {
      const docs = await OutreachModel.find().sort({ createdAt: -1 }).lean();
      if (docs.length > 0) {
        return {
          data: docs.map((doc) => {
            const plain = docToPlain(doc);
            return {
              id: plain.id,
              recipientName: plain.recipientName ?? "Unknown Recipient",
              company: plain.company ?? "Unknown Company",
              message: plain.message ?? "",
              status: (plain.status ?? "sent") as OutreachStatus,
              createdAt: new Date(plain.createdAt ?? Date.now()).toISOString(),
              approved: Boolean(plain.approved),
            };
          }),
          meta: dbMeta(),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load outreach logs from database.", error);
  }

  return {
    data: [...memoryState.outreach].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    meta: fallbackMeta("Using built-in outreach logs."),
  };
}

export async function approveOutreach(
  id: string,
): Promise<DataSource<OutreachRecord | null>> {
  try {
    if (await canUseDatabase()) {
      const updated = await OutreachModel.findByIdAndUpdate(
        id,
        { approved: true },
        { new: true },
      ).lean();

      if (!updated) {
        return { data: null, meta: dbMeta() };
      }

      const plain = docToPlain(updated);
      return {
        data: {
          id: plain.id,
          recipientName: plain.recipientName,
          company: plain.company,
          message: plain.message,
          status: plain.status as OutreachStatus,
          createdAt: new Date(plain.createdAt).toISOString(),
          approved: Boolean(plain.approved),
        },
        meta: dbMeta(),
      };
    }
  } catch (error) {
    console.error("Failed to approve outreach in database.", error);
  }

  const index = memoryState.outreach.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return { data: null, meta: fallbackMeta("Outreach log not found in fallback store.") };
  }

  memoryState.outreach[index] = { ...memoryState.outreach[index], approved: true };
  return {
    data: memoryState.outreach[index],
    meta: fallbackMeta("Outreach approved in in-memory fallback store."),
  };
}

export async function getPlacementStats(): Promise<
  DataSource<{
    summary: PlacementStatsRecord;
    charts: Array<{ year: number; avgCTC: number; companies: number; selectionRate: number }>;
  }>
> {
  try {
    if (await canUseDatabase()) {
      const [statsDoc, drivesDocs] = await Promise.all([
        PlacementStatsModel.findOne().sort({ updatedAt: -1 }).lean(),
        DriveModel.find().sort({ year: 1 }).lean(),
      ]);

      if (statsDoc) {
        const stats = docToPlain(statsDoc);
        const charts = (drivesDocs.length > 0 ? drivesDocs : defaultDrives).map((drive) => ({
          year: Number(drive.year),
          avgCTC: Number(drive.salary),
          companies: Number(drive.companies),
          selectionRate: Number(drive.selectionRate),
        }));

        return {
          data: {
            summary: {
              id: stats.id,
              totalOffers: Number(stats.totalOffers ?? 0),
              avgCTC: Number(stats.avgCTC ?? 0),
              placementRate: Number(stats.placementRate ?? 0),
              unplaced: Number(stats.unplaced ?? 0),
            },
            charts,
          },
          meta: dbMeta(),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load placement stats from database.", error);
  }

  return {
    data: {
      summary: memoryState.placementStats,
      charts: memoryState.drives.map((drive) => ({
        year: drive.year,
        avgCTC: drive.salary,
        companies: drive.companies,
        selectionRate: drive.selectionRate,
      })),
    },
    meta: fallbackMeta("Using built-in placement analytics."),
  };
}

export async function getDrives(filters: {
  year?: number;
  compareYear?: number;
}): Promise<
  DataSource<{
    drives: DriveRecord[];
    comparison: DriveRecord[];
  }>
> {
  const applyFilters = (records: DriveRecord[]) => {
    const filtered = filters.year
      ? records.filter((record) => record.year === filters.year)
      : records;
    const comparison = filters.compareYear
      ? records.filter((record) => record.year === filters.compareYear)
      : [];
    return { drives: filtered, comparison };
  };

  try {
    if (await canUseDatabase()) {
      const docs = await DriveModel.find().sort({ year: 1 }).lean();
      if (docs.length > 0) {
        return {
          data: applyFilters(
            docs.map((doc) => {
              const plain = docToPlain(doc);
              return {
                id: plain.id,
                year: Number(plain.year ?? 0),
                companies: Number(plain.companies ?? 0),
                roles: Number(plain.roles ?? 0),
                salary: Number(plain.salary ?? 0),
                selectionRate: Number(plain.selectionRate ?? 0),
              };
            }),
          ),
          meta: dbMeta(),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load drives from database.", error);
  }

  return {
    data: applyFilters(memoryState.drives),
    meta: fallbackMeta("Using built-in drive history."),
  };
}

export function buildDrivesCsv(drives: DriveRecord[]) {
  const header = "year,companies,roles,salary,selectionRate";
  const rows = drives.map((drive) =>
    [drive.year, drive.companies, drive.roles, drive.salary, drive.selectionRate].join(","),
  );
  return [header, ...rows].join("\n");
}
