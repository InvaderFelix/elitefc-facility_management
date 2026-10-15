export interface ServiceCard {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  message: string;
  links: { to: string; label: string; variant: "primary" | "secondary" }[];
}

export const SERVICE_CARDS: ServiceCard[] = [
  {
    eyebrow: "Book Courts",
    title: "Pitch Hire",
    body: "FIFA-grade indoor and outdoor pitches, open 7 days.",
    items: [
      "Indoor 7-a-side — $240 per hour",
      "Indoor 5-a-side — $120 per hour",
      "Outdoor 5-a-side — $110 per hour",
    ],
    message:
      "Log in to book a pitch for next session — or register if you haven't created an account yet.",
    links: [
      { to: "/booking", label: "Book a Pitch", variant: "primary" },
      { to: "/", label: "Log in", variant: "secondary" },
      { to: "/register", label: "Register", variant: "secondary" },
    ],
  },
  {
    eyebrow: "Competition",
    title: "Leagues",
    body: "Social and competitive football all year round with live results.",
    items: [
      "Adult League — Monday 7-a-side social · Tuesday intermediate",
      "Junior League — ESL summer competition",
      "Fixtures, results & replays published live",
    ],
    message:
      "Log in to enter your team into a league — or register if you haven't created an account yet.",
    links: [
      { to: "/", label: "Log in", variant: "primary" },
      { to: "/register", label: "Register", variant: "secondary" },
    ],
  },
  {
    eyebrow: "Weekends",
    title: "Birthday Parties",
    body: "Party packages with exclusive pitch use and our licensed cafe.",
    items: ["Saturdays & Sundays", "Party food packages available"],
    message:
      "Log in to book a party, register for an account, or contact us to enquire about availability.",
    links: [
      { to: "/contact", label: "Enquire", variant: "primary" },
    ],
  },
  {
    eyebrow: "Events",
    title: "Venue Hire",
    body: "Hire the whole venue for events, schools, tournaments and functions.",
    items: ["Change rooms & amenities", "Free on-site parking"],
    message:
      "Log in to book the venue, register for an account, or contact us to enquire about your event.",
    links: [
      { to: "/contact", label: "Enquire", variant: "primary" },
    ],
  },
  {
    eyebrow: "Members",
    title: "Gym Access",
    body: "A fully equipped strength and conditioning space for footballers.",
    items: ["Performance gym", "Bookable for your own training"],
    message:
      "Log in to book the gym, register for an account, or contact us to enquire about membership.",
    links: [
      { to: "/", label: "Log in", variant: "secondary" },
      { to: "/register", label: "Register", variant: "secondary" },
      { to: "/contact", label: "Enquire", variant: "primary" },
    ],
  },
  {
    eyebrow: "All Week",
    title: "Cafe & Licensed Bar",
    body: "Coffee, food and licensed bar for players, parents and spectators.",
    items: ["Monday–Friday 8am–8pm", "Saturday–Sunday 8am–9pm"],
    message:
      "Log in to book the cafe space, register for an account, or contact us to enquire about functions.",
    links: [
      { to: "/contact", label: "Enquire", variant: "primary" },
    ],
  },
];
