export interface PlayerExplainer {
  id: string;
  title: string;
  description: string;
  videoId: string;
  ageGroup: string;
}

export const EXPLAINERS: PlayerExplainer[] = [
  {
    id: "1",
    title: "First Touch Control",
    description:
      "Master the first touch — the most important skill in football. Learn how to receive passes under pressure and move into space.",
    videoId: "demo1",
    ageGroup: "U7-U10",
  },
  {
    id: "2",
    title: "Passing Accuracy",
    description:
      "Develop precise passing over short and long distances. Practice weight of pass and body positioning for consistent delivery.",
    videoId: "demo2",
    ageGroup: "U11-U14",
  },
  {
    id: "3",
    title: "Goalkeeping Fundamentals",
    description:
      "Basic stance, positioning, and shot-stopping techniques for aspiring goalkeepers. Build confidence between the posts.",
    videoId: "demo3",
    ageGroup: "All Ages",
  },
];

export interface AgeGroup {
  id: string;
  title: string;
  ageRange: string;
  description: string;
  focus: string[];
  entryRequirements?: string;
}

export const AGE_GROUPS: AgeGroup[] = [
  {
    id: "1",
    title: "Petite",
    ageRange: "Ages 3 to 5",
    description:
      "Petite is where the Elite FC pathway begins. Built for our youngest players, sessions are all about fun, movement, and falling in love with the ball.",
    focus: [
      "Fun, movement, and first touch",
      "Coordination, balance, and confidence",
      "Small groups with qualified coaches",
      "Purpose-built indoor facility, rain or shine",
    ],
    entryRequirements: "No experience necessary.",
  },
  {
    id: "2",
    title: "Pre-Academy",
    ageRange: "Ages 5 to 7",
    description:
      "Pre-Academy takes the fun of Petite and adds real structure. Players learn fundamentals in a way that keeps them engaged and moving — the bridge between first-time play and MiniRoos.",
    focus: [
      "Dribbling, passing, first touch, and game sense",
      "Structured skill sessions",
      "Qualified coaches with youth development experience",
      "Pathway forward into Academy / MiniRoos",
    ],
  },
  {
    id: "3",
    title: "Academy",
    ageRange: "Ages 7 to 13",
    description:
      "Academy is Elite FC's MiniRoos program. Small-sided football means more touches, more decisions, and more time on the ball — delivered with a real curriculum.",
    focus: [
      "MiniRoos small-sided football",
      "Qualified coaches and development curriculum",
      "Moonee Valley Knights FC partnership for Football Victoria competition",
      "Pathway to Juniors, Seniors, and <span className=\"elite360-green\">Elite360</span> / National Premier Leagues (NPL)",
      "National tournaments and international tour opportunities",
    ],
  },
  {
    id: "4",
    title: "Elite360" as unknown as string,
    ageRange: "Ages 13 to 18",
    description:
      "Elite high-performance program for advanced players seeking professional pathways.",
    focus: [
      "Elite technical training",
      "Strength and conditioning",
      "Mental performance",
      "Competitive match play",
    ],
    entryRequirements:
      "Trial and selection required. Partnership with Moonee Valley Knights FC.",
  },
];
