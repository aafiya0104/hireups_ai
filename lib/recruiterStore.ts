import { randomUUID } from "crypto";

import {
  defaultCandidates,
  defaultInterviews,
  defaultMessages,
  defaultOffers,
  defaultRecruiterCompany,
  defaultRecruiterId,
  defaultShortlists,
} from "@/data/recruiterSeed";
import {
  analyzeJobDescription,
  generateRecruiterMessage,
  rankCandidatesWithGroq,
} from "@/lib/aiService";
import { connectToDatabase } from "@/lib/db";
import type {
  AnalyticsPayload,
  ApiMeta,
  CandidateFilters,
  CandidateRecord,
  DiscoverPayload,
  InterviewRecord,
  MessageRecord,
  OfferRecord,
  OfferStatus,
  RankedCandidate,
  RecruiterShortlistRecord,
  ShortlistPayload,
} from "@/lib/recruiter-types";
import { CandidateModel } from "@/models/Candidate";
import { InterviewModel } from "@/models/Interview";
import { OfferModel } from "@/models/Offer";
import { RecruiterMessageModel } from "@/models/RecruiterMessage";
import { RecruiterShortlistModel } from "@/models/RecruiterShortlist";

type DataSource<T> = {
  data: T;
  meta: ApiMeta;
};

const memoryState = {
  candidates: structuredClone(defaultCandidates),
  shortlists: structuredClone(defaultShortlists),
  messages: structuredClone(defaultMessages),
  interviews: structuredClone(defaultInterviews),
  offers: structuredClone(defaultOffers),
};

let seedChecked = false;

function fallbackMeta(message: string): ApiMeta {
  return {
    source: "fallback",
    fallbackUsed: true,
    message,
  };
}

function dbMeta(message?: string): ApiMeta {
  return {
    source: "database",
    fallbackUsed: false,
    message,
  };
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value.toFixed(2))));
}

function docId<T extends { id?: string }>(doc: T) {
  return doc.id ?? randomUUID();
}

function normalizeCandidate(candidate: Partial<CandidateRecord>): CandidateRecord {
  return {
    id: candidate.id ?? randomUUID(),
    name: candidate.name?.trim() || "Unknown Candidate",
    branch: candidate.branch?.trim() || "Unknown Branch",
    cgpa: Number(candidate.cgpa ?? 0),
    skills: Array.isArray(candidate.skills) ? candidate.skills.filter(Boolean) : [],
    dsaScore: Number(candidate.dsaScore ?? 0),
    portfolioScore: Number(candidate.portfolioScore ?? 0),
    availability: Boolean(candidate.availability),
    email: candidate.email?.trim() || "",
    graduationYear: candidate.graduationYear,
    headline: candidate.headline?.trim() || "",
  };
}

function candidateQualityScore(candidate: CandidateRecord) {
  return clamp(
    candidate.cgpa * 8 +
      candidate.dsaScore * 0.45 +
      candidate.portfolioScore * 0.35 +
      candidate.skills.length * 2,
  );
}

function candidateDiscoveryScore(candidate: CandidateRecord, requiredSkills: string[]) {
  const normalizedSkills = candidate.skills.map((skill) => skill.toLowerCase());
  const matches = requiredSkills.filter((skill) => normalizedSkills.includes(skill.toLowerCase()));
  const skillScore = requiredSkills.length
    ? (matches.length / requiredSkills.length) * 100
    : Math.min(100, candidate.skills.length * 10);
  const availabilityBoost = candidate.availability ? 8 : -6;
  const total = clamp(
    skillScore * 0.46 +
      candidate.cgpa * 10 * 0.16 +
      candidate.dsaScore * 0.2 +
      candidate.portfolioScore * 0.18 +
      availabilityBoost,
  );

  const reasons = [
    matches.length
      ? `${matches.length} required skill${matches.length > 1 ? "s" : ""} matched`
      : "Skill overlap is limited",
    `CGPA ${candidate.cgpa.toFixed(1)} and DSA ${candidate.dsaScore}/100`,
    `${candidate.availability ? "Currently available" : "Availability needs confirmation"}`,
  ];

  return {
    score: total,
    matchedSkills: matches,
    reasons,
  };
}

function applyCandidateFilters(candidates: CandidateRecord[], filters: CandidateFilters) {
  const branch = filters.branch?.trim().toLowerCase() ?? "";
  const requestedSkills = (filters.skills ?? []).map((skill) => skill.toLowerCase()).filter(Boolean);

  return candidates.filter((candidate) => {
    const skillMatch = requestedSkills.length
      ? requestedSkills.every((skill) =>
          candidate.skills.some((candidateSkill) => candidateSkill.toLowerCase() === skill),
        )
      : true;
    const branchMatch = branch ? candidate.branch.toLowerCase().includes(branch) : true;
    const cgpaMatch = filters.minCgpa !== undefined ? candidate.cgpa >= filters.minCgpa : true;
    const dsaMatch =
      filters.minDsaScore !== undefined ? candidate.dsaScore >= filters.minDsaScore : true;
    const portfolioMatch =
      filters.minPortfolioScore !== undefined
        ? candidate.portfolioScore >= filters.minPortfolioScore
        : true;
    const availabilityMatch =
      filters.availability !== undefined ? candidate.availability === filters.availability : true;

    return (
      skillMatch &&
      branchMatch &&
      cgpaMatch &&
      dsaMatch &&
      portfolioMatch &&
      availabilityMatch
    );
  });
}

async function canUseDatabase() {
  return connectToDatabase();
}

async function ensureRecruiterSeeded() {
  if (seedChecked) {
    return true;
  }

  try {
    if (!(await canUseDatabase())) {
      return false;
    }

    const [
      candidateCount,
      shortlistCount,
      messageCount,
      interviewCount,
      offerCount,
    ] = await Promise.all([
      CandidateModel.countDocuments(),
      RecruiterShortlistModel.countDocuments(),
      RecruiterMessageModel.countDocuments(),
      InterviewModel.countDocuments(),
      OfferModel.countDocuments(),
    ]);

    const tasks: Promise<unknown>[] = [];

    if (candidateCount === 0) {
      tasks.push(CandidateModel.insertMany(defaultCandidates, { ordered: false }));
    }
    if (shortlistCount === 0) {
      tasks.push(RecruiterShortlistModel.insertMany(defaultShortlists, { ordered: false }));
    }
    if (messageCount === 0) {
      tasks.push(
        RecruiterMessageModel.insertMany(
          defaultMessages.map((entry) => ({ ...entry, timestamp: new Date(entry.timestamp) })),
          { ordered: false },
        ),
      );
    }
    if (interviewCount === 0) {
      tasks.push(
        InterviewModel.insertMany(
          defaultInterviews.map((entry) => ({ ...entry, date: new Date(entry.date) })),
          { ordered: false },
        ),
      );
    }
    if (offerCount === 0) {
      tasks.push(
        OfferModel.insertMany(
          defaultOffers.map((entry) => ({ ...entry, deadline: new Date(entry.deadline) })),
          { ordered: false },
        ),
      );
    }

    await Promise.all(tasks);
    seedChecked = true;
    return true;
  } catch (error) {
    console.error("Recruiter DB seeding skipped; fallback data will be used.", error);
    return false;
  }
}

function toShortlistRecord(doc: Partial<RecruiterShortlistRecord>): RecruiterShortlistRecord {
  return {
    id: docId(doc),
    recruiterId: doc.recruiterId?.trim() || defaultRecruiterId,
    candidateIds: Array.isArray(doc.candidateIds) ? doc.candidateIds : [],
    createdAt: new Date(doc.createdAt ?? Date.now()).toISOString(),
  };
}

function toMessageRecord(doc: Partial<MessageRecord>): MessageRecord {
  return {
    id: docId(doc),
    senderId: doc.senderId?.trim() || defaultRecruiterId,
    receiverId: doc.receiverId?.trim() || "",
    message: doc.message?.trim() || "",
    timestamp: new Date(doc.timestamp ?? Date.now()).toISOString(),
  };
}

function toInterviewRecord(doc: Partial<InterviewRecord>): InterviewRecord {
  return {
    id: docId(doc),
    candidateId: doc.candidateId?.trim() || "",
    recruiterId: doc.recruiterId?.trim() || defaultRecruiterId,
    date: new Date(doc.date ?? Date.now()).toISOString(),
    status: doc.status === "completed" ? "completed" : "scheduled",
  };
}

function toOfferRecord(doc: Partial<OfferRecord>): OfferRecord {
  return {
    id: docId(doc),
    candidateId: doc.candidateId?.trim() || "",
    company: doc.company?.trim() || defaultRecruiterCompany,
    salary: Number(doc.salary ?? 0),
    status:
      doc.status === "accepted" || doc.status === "rejected" ? doc.status : "issued",
    deadline: new Date(doc.deadline ?? Date.now()).toISOString(),
  };
}

async function loadCandidates() {
  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      const docs = await CandidateModel.find().lean();
      if (docs.length > 0) {
        return {
          records: docs.map((doc) => normalizeCandidate(doc)),
          meta: dbMeta("Candidate data loaded from MongoDB."),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load recruiter candidates from database.", error);
  }

  return {
    records: memoryState.candidates.map((entry) => normalizeCandidate(entry)),
    meta: fallbackMeta("Using built-in recruiter candidate dataset."),
  };
}

async function loadShortlists() {
  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      const docs = await RecruiterShortlistModel.find().lean();
      if (docs.length > 0) {
        return {
          records: docs.map((doc) => toShortlistRecord(doc)),
          meta: dbMeta("Shortlists loaded from MongoDB."),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load recruiter shortlists from database.", error);
  }

  return {
    records: memoryState.shortlists.map((entry) => toShortlistRecord(entry)),
    meta: fallbackMeta("Using built-in shortlist dataset."),
  };
}

async function loadMessages() {
  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      const docs = await RecruiterMessageModel.find().sort({ timestamp: 1 }).lean();
      if (docs.length > 0) {
        return {
          records: docs.map((doc) => toMessageRecord(doc)),
          meta: dbMeta("Messages loaded from MongoDB."),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load recruiter messages from database.", error);
  }

  return {
    records: memoryState.messages.map((entry) => toMessageRecord(entry)),
    meta: fallbackMeta("Using built-in message history."),
  };
}

async function loadInterviews() {
  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      const docs = await InterviewModel.find().sort({ date: 1 }).lean();
      if (docs.length > 0) {
        return {
          records: docs.map((doc) => toInterviewRecord(doc)),
          meta: dbMeta("Interviews loaded from MongoDB."),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load interviews from database.", error);
  }

  return {
    records: memoryState.interviews.map((entry) => toInterviewRecord(entry)),
    meta: fallbackMeta("Using built-in interview schedule."),
  };
}

async function loadOffers() {
  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      const docs = await OfferModel.find().sort({ deadline: 1 }).lean();
      if (docs.length > 0) {
        return {
          records: docs.map((doc) => toOfferRecord(doc)),
          meta: dbMeta("Offers loaded from MongoDB."),
        };
      }
    }
  } catch (error) {
    console.error("Failed to load offers from database.", error);
  }

  return {
    records: memoryState.offers.map((entry) => toOfferRecord(entry)),
    meta: fallbackMeta("Using built-in offer dataset."),
  };
}

export async function seedRecruiterDemoData(): Promise<
  DataSource<{ seeded: boolean; collections: string[] }>
> {
  try {
    if (await canUseDatabase()) {
      const seeded = await ensureRecruiterSeeded();
      return {
        data: {
          seeded,
          collections: [
            "candidates",
            "recruiter_shortlists",
            "messages",
            "interviews",
            "offers",
          ],
        },
        meta: seeded
          ? dbMeta("Recruiter demo collections are ready in MongoDB.")
          : fallbackMeta("MongoDB is configured but currently unreachable."),
      };
    }
  } catch (error) {
    console.error("Recruiter seed endpoint failed.", error);
  }

  return {
    data: {
      seeded: false,
      collections: ["fallback-memory"],
    },
    meta: fallbackMeta("MongoDB could not be reached. The app is using in-memory demo data."),
  };
}

export async function getRecruiterCandidates(
  filters: CandidateFilters = {},
): Promise<DataSource<CandidateRecord[]>> {
  const result = await loadCandidates();
  return {
    data: applyCandidateFilters(result.records, filters),
    meta: result.meta,
  };
}

export async function discoverRecruiterCandidates(input: {
  jobDescription: string;
  filters?: CandidateFilters;
}): Promise<DataSource<DiscoverPayload>> {
  const [candidateSource, insights] = await Promise.all([
    loadCandidates(),
    analyzeJobDescription(input.jobDescription),
  ]);

  const filtered = applyCandidateFilters(candidateSource.records, input.filters ?? {});
  const ranked: RankedCandidate[] = filtered.map((candidate) => {
    const discovery = candidateDiscoveryScore(candidate, insights.requiredSkills);
    return {
      ...candidate,
      score: discovery.score,
      qualityScore: candidateQualityScore(candidate),
      matchedSkills: discovery.matchedSkills,
      reasons: [...discovery.reasons],
    };
  });

  const aiRank = insights.aiUsed
    ? await rankCandidatesWithGroq(
        input.jobDescription,
        ranked.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          branch: candidate.branch,
          skills: candidate.skills,
          cgpa: candidate.cgpa,
        })),
      )
    : null;

  const aiReasonLookup = new Map(Object.entries(aiRank?.reasons ?? {}));
  const aiOrderLookup = new Map((aiRank?.rankedIds ?? []).map((id, index) => [id, index]));

  ranked.sort((left, right) => {
    const aiLeft = aiOrderLookup.get(left.id);
    const aiRight = aiOrderLookup.get(right.id);

    if (aiLeft !== undefined || aiRight !== undefined) {
      return (aiLeft ?? 999) - (aiRight ?? 999);
    }

    return right.score - left.score;
  });

  const hydrated = ranked.map((candidate, index) => ({
    ...candidate,
    score: clamp(candidate.score + Math.max(0, 8 - index)),
    reasons: aiReasonLookup.has(candidate.id)
      ? [aiReasonLookup.get(candidate.id) ?? "", ...candidate.reasons].filter(Boolean)
      : candidate.reasons,
  }));

  const metaMessage =
    candidateSource.meta.fallbackUsed || !insights.aiUsed
      ? "Fallback-safe discovery is active."
      : "MongoDB and Groq ranking are active.";

  return {
    data: {
      aiUsed: Boolean(aiRank && insights.aiUsed),
      insights: {
        requiredSkills: insights.requiredSkills,
        experienceLevel: insights.experienceLevel,
        hiringSignals: insights.hiringSignals,
      },
      candidates: hydrated,
    },
    meta:
      candidateSource.meta.source === "database" && insights.aiUsed
        ? dbMeta(metaMessage)
        : fallbackMeta(metaMessage),
  };
}

export async function saveRecruiterShortlist(input: {
  recruiterId?: string;
  candidateIds: string[];
}): Promise<DataSource<ShortlistPayload>> {
  const recruiterId = input.recruiterId?.trim() || defaultRecruiterId;
  const candidatesSource = await loadCandidates();
  const candidateIds = Array.from(new Set(input.candidateIds.filter(Boolean)));
  const shortlist: RecruiterShortlistRecord = {
    id: `shortlist_${recruiterId}`,
    recruiterId,
    candidateIds,
    createdAt: new Date().toISOString(),
  };

  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      await RecruiterShortlistModel.findOneAndUpdate(
        { recruiterId },
        { ...shortlist, createdAt: new Date(shortlist.createdAt) },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );

      return {
        data: {
          shortlist,
          candidates: candidatesSource.records.filter((candidate) => candidateIds.includes(candidate.id)),
        },
        meta: dbMeta("Shortlist saved to MongoDB."),
      };
    }
  } catch (error) {
    console.error("Failed to save shortlist in database.", error);
  }

  memoryState.shortlists = memoryState.shortlists.filter((entry) => entry.recruiterId !== recruiterId);
  memoryState.shortlists.unshift(shortlist);
  return {
    data: {
      shortlist,
      candidates: candidatesSource.records.filter((candidate) => candidateIds.includes(candidate.id)),
    },
    meta: fallbackMeta("Shortlist saved in fallback memory store."),
  };
}

export async function getRecruiterShortlist(
  recruiterId = defaultRecruiterId,
): Promise<DataSource<ShortlistPayload>> {
  const [shortlistsSource, candidatesSource] = await Promise.all([loadShortlists(), loadCandidates()]);
  const shortlist =
    shortlistsSource.records.find((entry) => entry.recruiterId === recruiterId) ??
    ({
      id: `shortlist_${recruiterId}`,
      recruiterId,
      candidateIds: [],
      createdAt: new Date().toISOString(),
    } satisfies RecruiterShortlistRecord);

  return {
    data: {
      shortlist,
      candidates: candidatesSource.records.filter((candidate) =>
        shortlist.candidateIds.includes(candidate.id),
      ),
    },
    meta: shortlistsSource.meta,
  };
}

export async function sendRecruiterMessageAction(input: {
  senderId?: string;
  receiverId: string;
  message?: string;
  candidateName?: string;
  role?: string;
  previewOnly?: boolean;
}): Promise<DataSource<MessageRecord | { preview: string }>> {
  const senderId = input.senderId?.trim() || defaultRecruiterId;
  const preview = await generateRecruiterMessage(
    input.candidateName?.trim() || "the candidate",
    defaultRecruiterCompany,
    input.role?.trim() || "Software Engineer",
  );
  const messageText = input.message?.trim() || preview;

  if (input.previewOnly) {
    return {
      data: { preview },
      meta: process.env.GROQ_API_KEY
        ? dbMeta("Message draft generated with Groq when available.")
        : fallbackMeta("Using default recruiter message template."),
    };
  }

  const record: MessageRecord = {
    id: randomUUID(),
    senderId,
    receiverId: input.receiverId,
    message: messageText,
    timestamp: new Date().toISOString(),
  };

  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      await RecruiterMessageModel.create({ ...record, timestamp: new Date(record.timestamp) });
      return {
        data: record,
        meta: dbMeta("Message saved to MongoDB."),
      };
    }
  } catch (error) {
    console.error("Failed to store recruiter message in database.", error);
  }

  memoryState.messages.push(record);
  return {
    data: record,
    meta: fallbackMeta("Message saved in fallback memory store."),
  };
}

export async function getRecruiterMessages(filters: {
  recruiterId?: string;
  candidateId?: string;
}): Promise<DataSource<MessageRecord[]>> {
  const recruiterId = filters.recruiterId?.trim() || defaultRecruiterId;
  const source = await loadMessages();
  const messages = source.records
    .filter((message) => {
      if (!filters.candidateId) {
        return message.senderId === recruiterId || message.receiverId === recruiterId;
      }
      return (
        (message.senderId === recruiterId && message.receiverId === filters.candidateId) ||
        (message.senderId === filters.candidateId && message.receiverId === recruiterId)
      );
    })
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp));

  return {
    data: messages,
    meta:
      messages.length > 0
        ? source.meta
        : fallbackMeta("No conversation found; using empty safe state."),
  };
}

export async function scheduleRecruiterInterview(input: {
  candidateId: string;
  recruiterId?: string;
  date: string;
  status?: "scheduled" | "completed";
}): Promise<DataSource<InterviewRecord>> {
  const interview: InterviewRecord = {
    id: randomUUID(),
    candidateId: input.candidateId,
    recruiterId: input.recruiterId?.trim() || defaultRecruiterId,
    date: new Date(input.date || Date.now()).toISOString(),
    status: input.status === "completed" ? "completed" : "scheduled",
  };

  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      await InterviewModel.create({ ...interview, date: new Date(interview.date) });
      return {
        data: interview,
        meta: dbMeta("Interview saved to MongoDB."),
      };
    }
  } catch (error) {
    console.error("Failed to save interview in database.", error);
  }

  memoryState.interviews.push(interview);
  return {
    data: interview,
    meta: fallbackMeta("Interview saved in fallback memory store."),
  };
}

export async function getRecruiterInterviews(
  recruiterId = defaultRecruiterId,
): Promise<DataSource<InterviewRecord[]>> {
  const source = await loadInterviews();
  return {
    data: source.records.filter((entry) => entry.recruiterId === recruiterId),
    meta: source.meta,
  };
}

export async function saveRecruiterOffer(input: {
  offerId?: string;
  candidateId: string;
  company?: string;
  salary: number;
  deadline: string;
  status?: OfferStatus;
}): Promise<DataSource<OfferRecord>> {
  const offer: OfferRecord = {
    id: input.offerId?.trim() || randomUUID(),
    candidateId: input.candidateId,
    company: input.company?.trim() || defaultRecruiterCompany,
    salary: Number(input.salary ?? 0),
    status: input.status ?? "issued",
    deadline: new Date(input.deadline || Date.now()).toISOString(),
  };

  try {
    if (await canUseDatabase()) {
      await ensureRecruiterSeeded();
      await OfferModel.findOneAndUpdate(
        { id: offer.id },
        { ...offer, deadline: new Date(offer.deadline) },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      return {
        data: offer,
        meta: dbMeta("Offer saved to MongoDB."),
      };
    }
  } catch (error) {
    console.error("Failed to save offer in database.", error);
  }

  memoryState.offers = memoryState.offers.filter((entry) => entry.id !== offer.id);
  memoryState.offers.push(offer);
  return {
    data: offer,
    meta: fallbackMeta("Offer saved in fallback memory store."),
  };
}

export async function getRecruiterOffers(): Promise<DataSource<OfferRecord[]>> {
  const source = await loadOffers();
  return {
    data: source.records,
    meta: source.meta,
  };
}

export async function getRecruiterAnalytics(): Promise<DataSource<AnalyticsPayload>> {
  const [candidateSource, shortlistSource, messageSource, interviewSource, offerSource] =
    await Promise.all([
      loadCandidates(),
      loadShortlists(),
      loadMessages(),
      loadInterviews(),
      loadOffers(),
    ]);

  const candidates = candidateSource.records;
  const offers = offerSource.records;
  const interviews = interviewSource.records;
  const messages = messageSource.records;
  const shortlist = shortlistSource.records[0];

  const acceptedOffers = offers.filter((offer) => offer.status === "accepted").length;
  const timeToHireValues = offers
    .filter((offer) => offer.status === "accepted")
    .map((offer) => {
      const firstMessage = messages.find(
        (message) => message.receiverId === offer.candidateId || message.senderId === offer.candidateId,
      );
      const offerDate = new Date(offer.deadline).getTime();
      const baseDate = firstMessage ? new Date(firstMessage.timestamp).getTime() : offerDate - 8 * 86400000;
      return Math.max(3, Math.round((offerDate - baseDate) / 86400000));
    });

  const averageTimeToHire =
    timeToHireValues.length > 0
      ? clamp(timeToHireValues.reduce((sum, value) => sum + value, 0) / timeToHireValues.length, 0, 365)
      : 12;

  const qualityPool = shortlist?.candidateIds.length
    ? candidates.filter((candidate) => shortlist.candidateIds.includes(candidate.id))
    : candidates;
  const candidateQualityScoreAverage =
    qualityPool.length > 0
      ? clamp(
          qualityPool.reduce((sum, candidate) => sum + candidateQualityScore(candidate), 0) /
            qualityPool.length,
        )
      : 81;

  const activity = [
    ...messages.slice(-3).map((message) => ({
      label: "Message",
      detail: `Conversation update for ${message.receiverId}`,
      timestamp: message.timestamp,
    })),
    ...interviews.slice(-2).map((interview) => ({
      label: "Interview",
      detail: `${interview.status} interview for ${interview.candidateId}`,
      timestamp: interview.date,
    })),
    ...offers.slice(-2).map((offer) => ({
      label: "Offer",
      detail: `${offer.status} offer for ${offer.candidateId}`,
      timestamp: offer.deadline,
    })),
  ]
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
    .slice(0, 6);

  const qualityByBranch = Array.from(
    candidates.reduce((map, candidate) => {
      const list = map.get(candidate.branch) ?? [];
      list.push(candidateQualityScore(candidate));
      map.set(candidate.branch, list);
      return map;
    }, new Map<string, number[]>()),
  ).map(([label, values]) => ({
    label,
    value: clamp(values.reduce((sum, value) => sum + value, 0) / values.length),
  }));

  const timeline = [
    { label: "Messages", value: messages.length || 4 },
    { label: "Shortlisted", value: shortlist?.candidateIds.length || 3 },
    { label: "Interviews", value: interviews.length || 2 },
    { label: "Offers", value: offers.length || 2 },
  ];

  const payload: AnalyticsPayload = {
    kpis: {
      timeToHire: averageTimeToHire,
      offerAcceptanceRate: offers.length ? clamp((acceptedOffers / offers.length) * 100) : 50,
      candidateQualityScore: candidateQualityScoreAverage,
      activeCandidates: candidates.filter((candidate) => candidate.availability).length || 4,
    },
    charts: {
      offersByStatus: [
        { label: "Issued", value: offers.filter((offer) => offer.status === "issued").length || 1 },
        { label: "Accepted", value: acceptedOffers || 1 },
        { label: "Rejected", value: offers.filter((offer) => offer.status === "rejected").length || 1 },
      ],
      qualityByBranch: qualityByBranch.length > 0 ? qualityByBranch : [{ label: "Computer Science", value: 84 }],
      hiringTimeline: timeline,
    },
    recruiterActivity: activity.length > 0 ? activity : [
      {
        label: "Fallback",
        detail: "Analytics are using resilient demo history.",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const usingFallback =
    candidateSource.meta.fallbackUsed ||
    shortlistSource.meta.fallbackUsed ||
    messageSource.meta.fallbackUsed ||
    interviewSource.meta.fallbackUsed ||
    offerSource.meta.fallbackUsed;

  return {
    data: payload,
    meta: usingFallback
      ? fallbackMeta("Analytics are powered by fallback-safe recruiter data.")
      : dbMeta("Analytics are powered by MongoDB data."),
  };
}
