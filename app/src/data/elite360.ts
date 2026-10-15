export interface Program {
  id: string;
  title: string;
  tag: string;
  description: string;
  pricing: string;
  included: { title: string; body: string }[];
  forWhom: string;
}

export const PROGRAMS: Program[] = [
  {
    id: "pathway",
    title: "Pathway Program",
    tag: "Community Clubs → NPL",
    description:
      "Structured football development for community club kids working towards NPL. Twice-weekly sessions, S&C and mentorship in Melbourne.",
    pricing:
      "From $29/week, direct debit. Two sessions a week plus mentorship and your player assessment.",
    included: [
      {
        title: "1:1 Player Assessment (60 minutes)",
        body: "Baseline performance, player history and individual goals, so every session is built around your child, not a template.",
      },
      {
        title: "Football Intelligence Sessions (Tuesdays and Thursdays, 60 minutes)",
        body: "Attack, defence, keeper work, movement, technique and precision. Where players learn to read the game, not just run around in it.",
      },
      {
        title: "Monthly Strength & Conditioning (60 minutes)",
        body: "One Thursday each month in the gym: movement quality, strength, power, recovery, mindset, nutrition and game analysis.",
      },
      {
        title: "Mentorship Program",
        body: "Ongoing guidance for young footballers with their sights set on senior football, locally, nationally or abroad.",
      },
    ],
    forWhom:
      "For talented kids currently playing community club football who want a genuine route towards NPL or senior football. If your child trains once or twice a week with their club and you can feel they have more in them, this is the step up.",
  },
  {
    id: "professional",
    title: "Professional Program",
    tag: "NPL → Pro",
    description:
      "For NPL players who want the edge. Football-specific strength and conditioning, intelligence sessions and mentorship in Melbourne.",
    pricing:
      "From $49/week, direct debit. Two S&C sessions, one Football Intelligence session, mentorship and your player assessment.",
    included: [
      {
        title: "1:1 Player Assessment (60 minutes)",
        body: "Baseline performance, player history and individual goals mapped before a single rep. Everything that follows is built on this.",
      },
      {
        title: "Strength & Conditioning Sessions (Twice weekly, 60 minutes)",
        body: "Football gym sessions focused on movement quality, strength, power, recovery and coordination — the physical edge, developed the way pro programs develop it.",
      },
      {
        title: "Football Intelligence Session (Weekly, 60 minutes)",
        body: "Mindset, nutrition, movement, technique and precision. The one-percenters that decide who gets the call.",
      },
      {
        title: "Mentorship Program",
        body: "For young footballers targeting senior football locally, nationally or abroad, guided by people who have walked the pathway.",
      },
    ],
    forWhom:
      "For NPL players who already train three or more times a week with their club and want an edge on the competition. This is the strength, conditioning and mental development that turns a good NPL player into one that clubs, scouts and senior sides pay attention to.",
  },
];

export const GAP_STATS = [
  {
    value: "50%",
    label: "Academy players leave the system before age 16",
  },
  {
    value: "98%",
    label: "Scholarship holders at 16 are out of the top five tiers by 18",
  },
  {
    value: "97%",
    label: "Former elite academy players aged 21 to 26 never play top-flight",
  },
];

export const AUSTRALIA_STALL = [
  "Elite players worldwide debut in senior football at ~18 years, 13 days on average. Australian A-League debutants average 19 years, 2 days since 2023–24.",
  "In a full round of senior NPL for A-League academy sides, the median and most common birth year of starters was 2007 (18 to 19 year olds). Fewer than 7.3% of starters were 16 or younger.",
  "Of 300+ players at last year's U16 Emerging Socceroos Championships, only 14 have started a single senior NPL game this season — most just once.",
  "Australia's own 'golden generation' were playing senior men's football at an average age of 15.4. That's now extremely rare.",
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    id: "who",
    question: "Who is E360 for?",
    answer:
      "E360 is for talented footballers on their pathway to the top — available to U13 players through to senior players looking for more.",
  },
  {
    id: "difference",
    question: "What's the difference between the Pathway and Professional Programs?",
    answer:
      "The Pathway Program builds community club players towards NPL and the Professional Program gives NPL players the professional edge.",
  },
  {
    id: "full-part",
    question: "Are programs full-time or part-time?",
    answer:
      "Both. E360 runs full-time and part-time programs, designed to work alongside your club commitments.",
  },
  {
    id: "location",
    question: "Where do sessions run?",
    answer:
      "At Elite Football Training Facilities — 169 Rosamond Rd, Maribyrnong VIC 3032. Gym, field training and classroom sessions under one roof.",
  },
];
