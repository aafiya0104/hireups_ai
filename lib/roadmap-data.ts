// ─── Types ────────────────────────────────────────────────────────────────────

export type Branch = "CS" | "IT" | "ECE" | "Mech" | "Civil";
export type Track =
  | "DSA"
  | "OS"
  | "DBMS"
  | "OOP"
  | "System Design"
  | "Aptitude"
  | "CN"
  | "Digital Electronics"
  | "Thermodynamics"
  | "Engineering Mechanics"
  | "Structural Analysis";
export type DayStatus = "done" | "active" | "upcoming" | "missed";
export type TopicStatus =
  | "locked"
  | "upcoming"
  | "in-progress"
  | "completed"
  | "needs-review";
export type XPLevel =
  | "Beginner"
  | "Apprentice"
  | "Proficient"
  | "Expert"
  | "Placement-Ready";

export interface CalendarDay {
  date: string; // "Mon", "Tue"…
  day: number;
  status: DayStatus;
  tasksTotal: number;
  tasksDone: number;
}

export interface Task {
  id: string;
  title: string;
  topic: Track;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  xp: number;
  completed: boolean;
  tooHard?: boolean;
}

export interface TopicMastery {
  topic: Track;
  percent: number;
  color: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  topics: RoadmapTopic[];
}

export interface RoadmapTopic {
  id: string;
  title: string;
  track: Track;
  status: TopicStatus;
  estimatedHours: number;
  xp: number;
  prerequisiteIds: string[];
  subtopics: string[];
  problems: { title: string; platform: string; difficulty: string }[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

export const BRANCH_TRACKS: Record<Branch, Track[]> = {
  CS: ["DSA", "OS", "DBMS", "OOP", "System Design", "Aptitude", "CN"],
  IT: ["DSA", "OS", "DBMS", "OOP", "System Design", "Aptitude", "CN"],
  ECE: [
    "DSA",
    "OOP",
    "Digital Electronics",
    "OS",
    "Aptitude",
    "CN",
  ],
  Mech: ["DSA", "Aptitude", "OOP", "Thermodynamics", "Engineering Mechanics"],
  Civil: ["DSA", "Aptitude", "OOP", "Structural Analysis"],
};

export const TRACK_META: Record<
  Track,
  { icon: string; desc: string; xpPerTopic: number; color: string }
> = {
  DSA: {
    icon: "⚡",
    desc: "Arrays, Trees, Graphs, DP",
    xpPerTopic: 80,
    color: "#6666ff",
  },
  OS: {
    icon: "🖥",
    desc: "Processes, Memory, Scheduling",
    xpPerTopic: 60,
    color: "#b9f0d7",
  },
  DBMS: {
    icon: "🗄",
    desc: "SQL, Normalization, ACID",
    xpPerTopic: 55,
    color: "#c9e8ff",
  },
  OOP: {
    icon: "🏗",
    desc: "Inheritance, Polymorphism, SOLID",
    xpPerTopic: 50,
    color: "#b8baff",
  },
  "System Design": {
    icon: "🏛",
    desc: "HLD, LLD, Scalability",
    xpPerTopic: 90,
    color: "#f0c9b9",
  },
  Aptitude: {
    icon: "🧮",
    desc: "Quant, Logical, Verbal",
    xpPerTopic: 30,
    color: "#f0e5b9",
  },
  CN: {
    icon: "🌐",
    desc: "TCP/IP, HTTP, DNS",
    xpPerTopic: 60,
    color: "#b9d4f0",
  },
  "Digital Electronics": {
    icon: "🔌",
    desc: "Logic gates, Flip-flops",
    xpPerTopic: 50,
    color: "#d4b9f0",
  },
  Thermodynamics: {
    icon: "🔥",
    desc: "Laws, Entropy, Heat transfer",
    xpPerTopic: 45,
    color: "#f0b9b9",
  },
  "Engineering Mechanics": {
    icon: "⚙️",
    desc: "Statics, Dynamics, Kinematics",
    xpPerTopic: 45,
    color: "#b9f0e5",
  },
  "Structural Analysis": {
    icon: "🏗",
    desc: "Beams, Frames, Trusses",
    xpPerTopic: 45,
    color: "#e5f0b9",
  },
};

export const SAMPLE_WEEK_CALENDAR: CalendarDay[] = [
  { date: "Mon", day: 7, status: "done", tasksTotal: 4, tasksDone: 4 },
  { date: "Tue", day: 8, status: "done", tasksTotal: 3, tasksDone: 3 },
  { date: "Wed", day: 9, status: "missed", tasksTotal: 4, tasksDone: 1 },
  { date: "Thu", day: 10, status: "active", tasksTotal: 4, tasksDone: 2 },
  { date: "Fri", day: 11, status: "upcoming", tasksTotal: 3, tasksDone: 0 },
  { date: "Sat", day: 12, status: "upcoming", tasksTotal: 2, tasksDone: 0 },
  { date: "Sun", day: 13, status: "upcoming", tasksTotal: 1, tasksDone: 0 },
];

export const SAMPLE_TASKS: Task[] = [
  {
    id: "t1",
    title: "Binary Search – iterative & recursive",
    topic: "DSA",
    difficulty: "Easy",
    estimatedMinutes: 45,
    xp: 60,
    completed: true,
  },
  {
    id: "t2",
    title: "Two-pointer sliding window patterns",
    topic: "DSA",
    difficulty: "Medium",
    estimatedMinutes: 60,
    xp: 80,
    completed: true,
  },
  {
    id: "t3",
    title: "Process Scheduling: FCFS, SJF, Round Robin",
    topic: "OS",
    difficulty: "Medium",
    estimatedMinutes: 50,
    xp: 65,
    completed: false,
  },
  {
    id: "t4",
    title: "SQL Joins and Subqueries practice",
    topic: "DBMS",
    difficulty: "Easy",
    estimatedMinutes: 40,
    xp: 50,
    completed: false,
  },
];

export const SAMPLE_MASTERY: TopicMastery[] = [
  { topic: "DSA", percent: 62, color: "#6666ff" },
  { topic: "OS", percent: 38, color: "#b9f0d7" },
  { topic: "DBMS", percent: 27, color: "#c9e8ff" },
  { topic: "OOP", percent: 55, color: "#b8baff" },
  { topic: "System Design", percent: 10, color: "#f0c9b9" },
  { topic: "Aptitude", percent: 70, color: "#f0e5b9" },
];

export const SAMPLE_ROADMAP: RoadmapWeek[] = [
  {
    weekNumber: 1,
    theme: "Foundations — Arrays & Strings",
    topics: [
      {
        id: "w1t1",
        title: "Arrays Basics",
        track: "DSA",
        status: "completed",
        estimatedHours: 3,
        xp: 80,
        prerequisiteIds: [],
        subtopics: [
          "Declaration & initialization",
          "Traversal patterns",
          "Prefix sums",
        ],
        problems: [
          { title: "Two Sum", platform: "LeetCode", difficulty: "Easy" },
          { title: "Best Time to Buy Stock", platform: "LeetCode", difficulty: "Easy" },
        ],
      },
      {
        id: "w1t2",
        title: "Strings & Hashing",
        track: "DSA",
        status: "completed",
        estimatedHours: 3,
        xp: 80,
        prerequisiteIds: ["w1t1"],
        subtopics: ["Character maps", "Anagram checks", "Sliding window"],
        problems: [
          { title: "Valid Anagram", platform: "LeetCode", difficulty: "Easy" },
          { title: "Longest Substring No Repeat", platform: "LeetCode", difficulty: "Medium" },
        ],
      },
    ],
  },
  {
    weekNumber: 2,
    theme: "Searching & Sorting",
    topics: [
      {
        id: "w2t1",
        title: "Binary Search",
        track: "DSA",
        status: "completed",
        estimatedHours: 4,
        xp: 100,
        prerequisiteIds: ["w1t1"],
        subtopics: [
          "Classic binary search",
          "Lower/upper bound",
          "Search in rotated array",
        ],
        problems: [
          { title: "Binary Search", platform: "LeetCode", difficulty: "Easy" },
          { title: "Search Rotated Sorted Array", platform: "LeetCode", difficulty: "Medium" },
        ],
      },
      {
        id: "w2t2",
        title: "Sorting Algorithms",
        track: "DSA",
        status: "in-progress",
        estimatedHours: 3,
        xp: 80,
        prerequisiteIds: ["w1t1"],
        subtopics: ["Merge sort", "Quick sort", "Heap sort"],
        problems: [
          { title: "Sort Colors", platform: "LeetCode", difficulty: "Medium" },
          { title: "Merge Intervals", platform: "LeetCode", difficulty: "Medium" },
        ],
      },
    ],
  },
  {
    weekNumber: 3,
    theme: "Trees & Recursion",
    topics: [
      {
        id: "w3t1",
        title: "Binary Trees",
        track: "DSA",
        status: "upcoming",
        estimatedHours: 5,
        xp: 120,
        prerequisiteIds: ["w2t1"],
        subtopics: ["Traversals (BFS/DFS)", "Height & depth", "LCA"],
        problems: [
          { title: "Max Depth of Binary Tree", platform: "LeetCode", difficulty: "Easy" },
          { title: "Level Order Traversal", platform: "LeetCode", difficulty: "Medium" },
        ],
      },
      {
        id: "w3t2",
        title: "Binary Search Trees",
        track: "DSA",
        status: "locked",
        estimatedHours: 4,
        xp: 100,
        prerequisiteIds: ["w3t1", "w2t1"],
        subtopics: ["Insert/Delete/Search", "Validation", "BST to sorted array"],
        problems: [
          { title: "Validate BST", platform: "LeetCode", difficulty: "Medium" },
          { title: "Kth Smallest in BST", platform: "LeetCode", difficulty: "Medium" },
        ],
      },
    ],
  },
  {
    weekNumber: 4,
    theme: "OS Concepts & Scheduling",
    topics: [
      {
        id: "w4t1",
        title: "Process Management",
        track: "OS",
        status: "upcoming",
        estimatedHours: 3,
        xp: 75,
        prerequisiteIds: [],
        subtopics: ["Process vs Thread", "PCB", "Context switching"],
        problems: [],
      },
      {
        id: "w4t2",
        title: "CPU Scheduling Algorithms",
        track: "OS",
        status: "upcoming",
        estimatedHours: 4,
        xp: 80,
        prerequisiteIds: ["w4t1"],
        subtopics: ["FCFS", "SJF", "Round Robin", "Priority"],
        problems: [],
      },
    ],
  },
];

// ─── XP Level thresholds ──────────────────────────────────────────────────────

export const XP_LEVELS: { level: XPLevel; minXP: number; color: string }[] = [
  { level: "Beginner", minXP: 0, color: "#6b7280" },
  { level: "Apprentice", minXP: 500, color: "#10b981" },
  { level: "Proficient", minXP: 1500, color: "#6666ff" },
  { level: "Expert", minXP: 3000, color: "#f59e0b" },
  { level: "Placement-Ready", minXP: 5000, color: "#b9f0d7" },
];

export function getLevel(xp: number) {
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVELS[i].minXP) return XP_LEVELS[i];
  }
  return XP_LEVELS[0];
}

export function getNextLevel(xp: number) {
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp < XP_LEVELS[i].minXP) return XP_LEVELS[i];
  }
  return null;
}
