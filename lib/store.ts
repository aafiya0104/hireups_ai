import { connectToDatabase } from "@/lib/db";
import { ContestModel } from "@/lib/models/Contest";
import { DiscussionModel } from "@/lib/models/Discussion";
import { DriveExperienceModel } from "@/lib/models/DriveExperience";
import { RoadmapModel } from "@/lib/models/Roadmap";
import { SubmissionModel } from "@/lib/models/Submission";
import { UserModel } from "@/lib/models/User";
import { buildRoadmap, updateRoadmapProgress } from "@/lib/services/roadmap";
import { createSeedData } from "@/lib/services/seed";
import { createId } from "@/lib/utils";
import type {
  ContestRecord,
  DiscussionRecord,
  DriveExperienceRecord,
  RoadmapRecord,
  SubmissionRecord,
  UserRecord,
} from "@/lib/types";

type MemoryStore = {
  users: UserRecord[];
  roadmaps: RoadmapRecord[];
  contests: ContestRecord[];
  submissions: SubmissionRecord[];
  discussions: DiscussionRecord[];
  drives: DriveExperienceRecord[];
  ready: boolean;
};

declare global {
  var hireupsMemory: MemoryStore | undefined;
}

async function getMemoryStore() {
  if (!global.hireupsMemory || !global.hireupsMemory.ready) {
    const seed = await createSeedData();
    global.hireupsMemory = { ...seed, ready: true };
  }
  return global.hireupsMemory;
}

export async function ensureSeeded() {
  if (process.env.MONGODB_URI) {
    await connectToDatabase();
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      const seed = await createSeedData();
      await UserModel.insertMany(seed.users);
      await RoadmapModel.insertMany(seed.roadmaps);
      await ContestModel.insertMany(seed.contests);
      await SubmissionModel.insertMany(seed.submissions);
      await DiscussionModel.insertMany(seed.discussions);
      await DriveExperienceModel.insertMany(seed.drives);
    }
    return;
  }

  await getMemoryStore();
}

function mapMongoId<T>(doc: Record<string, unknown>) {
  const rest = { ...doc };
  delete rest._id;
  return rest as T;
}

export async function getUserByEmail(email: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const doc = await UserModel.findOne({ email }).lean();
    return doc ? mapMongoId<UserRecord>(doc) : null;
  }
  const store = await getMemoryStore();
  return store.users.find((user) => user.email === email) || null;
}

export async function getUserById(id: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const doc = await UserModel.findOne({ id }).lean();
    return doc ? mapMongoId<UserRecord>(doc) : null;
  }
  const store = await getMemoryStore();
  return store.users.find((user) => user.id === id) || null;
}

export async function createUser(user: UserRecord) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await UserModel.create(user);
    return user;
  }
  const store = await getMemoryStore();
  store.users.push(user);
  return user;
}

export async function updateUser(userId: string, patch: Partial<UserRecord>) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await UserModel.updateOne({ id: userId }, patch);
    return getUserById(userId);
  }
  const store = await getMemoryStore();
  const user = store.users.find((entry) => entry.id === userId);
  if (!user) return null;
  Object.assign(user, patch, { updatedAt: new Date().toISOString() });
  return user;
}

export async function listRoadmaps(userId: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const docs = await RoadmapModel.find({ userId }).lean();
    return docs.map((doc: any) => mapMongoId<RoadmapRecord>(doc));
  }
  const store = await getMemoryStore();
  return store.roadmaps.filter((roadmap) => roadmap.userId === userId);
}

export async function createRoadmapForUser(input: Parameters<typeof buildRoadmap>[0]) {
  await ensureSeeded();
  const roadmap = await buildRoadmap(input);
  if (process.env.MONGODB_URI) {
    await RoadmapModel.create(roadmap);
  } else {
    const store = await getMemoryStore();
    store.roadmaps = store.roadmaps.filter((entry) => entry.userId !== input.userId);
    store.roadmaps.push(roadmap);
  }
  return roadmap;
}

export async function toggleRoadmapTask(roadmapId: string, taskId: string, completed: boolean) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const roadmapDoc = await RoadmapModel.findOne({ id: roadmapId }).lean();
    if (!roadmapDoc) return null;
    const updated = updateRoadmapProgress(mapMongoId<RoadmapRecord>(roadmapDoc), taskId, completed);
    await RoadmapModel.updateOne({ id: roadmapId }, updated);
    return updated;
  }
  const store = await getMemoryStore();
  const roadmap = store.roadmaps.find((entry) => entry.id === roadmapId);
  if (!roadmap) return null;
  const updated = updateRoadmapProgress(roadmap, taskId, completed);
  store.roadmaps = store.roadmaps.map((entry) => (entry.id === roadmapId ? updated : entry));
  return updated;
}

export async function listContests() {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const docs = await ContestModel.find().sort({ startTime: 1 }).lean();
    return docs.map((doc: any) => mapMongoId<ContestRecord>(doc));
  }
  const store = await getMemoryStore();
  return store.contests.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export async function getContestById(id: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const doc = await ContestModel.findOne({ id }).lean();
    return doc ? mapMongoId<ContestRecord>(doc) : null;
  }
  const store = await getMemoryStore();
  return store.contests.find((contest) => contest.id === id) || null;
}

export async function createContest(contest: ContestRecord) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await ContestModel.create(contest);
  } else {
    const store = await getMemoryStore();
    store.contests.push(contest);
  }
  return contest;
}

export async function updateContest(id: string, patch: Partial<ContestRecord>) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await ContestModel.updateOne({ id }, patch);
    return getContestById(id);
  }
  const store = await getMemoryStore();
  const contest = store.contests.find((entry) => entry.id === id);
  if (!contest) return null;
  Object.assign(contest, patch, { updatedAt: new Date().toISOString() });
  return contest;
}

export async function createSubmission(submission: SubmissionRecord) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await SubmissionModel.create(submission);
  } else {
    const store = await getMemoryStore();
    store.submissions.push(submission);
  }
  return submission;
}

export async function listSubmissions(contestId: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const docs = await SubmissionModel.find({ contestId }).lean();
    return docs.map((doc: any) => mapMongoId<SubmissionRecord>(doc));
  }
  const store = await getMemoryStore();
  return store.submissions.filter((submission) => submission.contestId === contestId);
}

export async function createDiscussion(entry: DiscussionRecord) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await DiscussionModel.create(entry);
  } else {
    const store = await getMemoryStore();
    store.discussions.push(entry);
  }
  return entry;
}

export async function listDiscussions(contestId: string, problemId?: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    const docs = await DiscussionModel.find(problemId ? { contestId, problemId } : { contestId }).lean();
    return docs.map((doc: any) => mapMongoId<DiscussionRecord>(doc));
  }
  const store = await getMemoryStore();
  return store.discussions.filter(
    (entry) => entry.contestId === contestId && (!problemId || entry.problemId === problemId),
  );
}

export async function upvoteDiscussion(id: string) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await DiscussionModel.updateOne({ id }, { $inc: { upvotes: 1 } });
    const doc = await DiscussionModel.findOne({ id }).lean();
    return doc ? mapMongoId<DiscussionRecord>(doc) : null;
  }
  const store = await getMemoryStore();
  const discussion = store.discussions.find((entry) => entry.id === id);
  if (!discussion) return null;
  discussion.upvotes += 1;
  return discussion;
}

export async function listDrives(filters?: { company?: string; role?: string; year?: string; branch?: string; status?: string }) {
  await ensureSeeded();
  const applyFilters = (items: DriveExperienceRecord[]) =>
    items.filter((drive) => {
      if (filters?.company && drive.company.toLowerCase() !== filters.company.toLowerCase()) return false;
      if (filters?.role && !drive.role.toLowerCase().includes(filters.role.toLowerCase())) return false;
      if (filters?.year && String(drive.year) !== filters.year) return false;
      if (filters?.branch && drive.branch.toLowerCase() !== filters.branch.toLowerCase()) return false;
      if (filters?.status && drive.status !== filters.status) return false;
      return true;
    });

  if (process.env.MONGODB_URI) {
    const docs = await DriveExperienceModel.find().sort({ year: -1 }).lean();
    return applyFilters(docs.map((doc: any) => mapMongoId<DriveExperienceRecord>(doc)));
  }
  const store = await getMemoryStore();
  return applyFilters(store.drives);
}

export async function createDrive(drive: DriveExperienceRecord) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await DriveExperienceModel.create(drive);
  } else {
    const store = await getMemoryStore();
    store.drives.push(drive);
  }
  return drive;
}

export async function moderateDrive(id: string, status: DriveExperienceRecord["status"]) {
  await ensureSeeded();
  if (process.env.MONGODB_URI) {
    await DriveExperienceModel.updateOne({ id }, { status, updatedAt: new Date().toISOString() });
    const doc = await DriveExperienceModel.findOne({ id }).lean();
    return doc ? mapMongoId<DriveExperienceRecord>(doc) : null;
  }
  const store = await getMemoryStore();
  const drive = store.drives.find((entry) => entry.id === id);
  if (!drive) return null;
  drive.status = status;
  drive.updatedAt = new Date().toISOString();
  return drive;
}

export async function getAnalytics() {
  await ensureSeeded();
  const memory = await getMemoryStore();
  const users = process.env.MONGODB_URI ? (await UserModel.find().lean()).map((doc: any) => mapMongoId<UserRecord>(doc)) : memory.users;
  const roadmaps = process.env.MONGODB_URI ? (await RoadmapModel.find().lean()).map((doc: any) => mapMongoId<RoadmapRecord>(doc)) : memory.roadmaps;
  const contests = process.env.MONGODB_URI ? (await ContestModel.find().lean()).map((doc: any) => mapMongoId<ContestRecord>(doc)) : memory.contests;
  const submissions = process.env.MONGODB_URI ? (await SubmissionModel.find().lean()).map((doc: any) => mapMongoId<SubmissionRecord>(doc)) : memory.submissions;
  const drives = process.env.MONGODB_URI ? (await DriveExperienceModel.find().lean()).map((doc: any) => mapMongoId<DriveExperienceRecord>(doc)) : memory.drives;

  return {
    users: users.length,
    admins: users.filter((user: any) => user.role === "admin").length,
    averageRoadmapProgress: roadmaps.length
      ? Math.round(roadmaps.reduce((sum: any, roadmap: any) => sum + roadmap.progress, 0) / roadmaps.length)
      : 0,
    activeContests: contests.filter((contest: any) => contest.status === "live").length,
    submissions: submissions.length,
    approvedDrives: drives.filter((drive: any) => drive.status === "approved").length,
  };
}

export async function saveCompany(userId: string, company: UserRecord["savedCompanies"][number]) {
  const user = await getUserById(userId);
  if (!user) return null;
  const savedCompanies = [...user.savedCompanies.filter((entry) => entry.companyId !== company.companyId), company];
  return updateUser(userId, { savedCompanies });
}

export function createRecordId(prefix: string) {
  return createId(prefix);
}
