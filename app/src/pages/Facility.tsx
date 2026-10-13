import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import "../App.css";

interface ServiceCard {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  message: string;
  links: { to: string; label: string; variant: "primary" | "secondary" }[];
}

const SERVICE_CARDS: ServiceCard[] = [
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
      { to: "/", label: "Log in", variant: "primary" },
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
      { to: "/", label: "Log in", variant: "primary" },
      { to: "/register", label: "Register", variant: "secondary" },
      { to: "/contact", label: "Enquire", variant: "secondary" },
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
      { to: "/", label: "Log in", variant: "primary" },
      { to: "/register", label: "Register", variant: "secondary" },
      { to: "/contact", label: "Enquire", variant: "secondary" },
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
      { to: "/", label: "Log in", variant: "primary" },
      { to: "/register", label: "Register", variant: "secondary" },
      { to: "/contact", label: "Enquire", variant: "secondary" },
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
      { to: "/", label: "Log in", variant: "primary" },
      { to: "/register", label: "Register", variant: "secondary" },
      { to: "/contact", label: "Enquire", variant: "secondary" },
    ],
  },
];

export function Facility() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setOpenCard((current) => (current === index ? null : index));
  };

  const handleCardKey = (
    event: KeyboardEvent<HTMLElement>,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleCard(index);
    }
  };

  return (
    <main className="content">
      <section className="hero-split">
        <section className="hero">
          <div className="eyebrow">FACILITY</div>

          <h1>
            Local Facility
            <span>Elite Training</span>
          </h1>

          <p className="hero-description">
            Structured training programs for players aged 7 to 18. Technical
            development, tactical awareness, and physical progression in a
            purpose-built facility.
          </p>
        </section>
      </section>

      <section className="academy-services">
        <div className="section-heading">
          <div className="eyebrow">FACILITY SERVICES</div>
          <h2>Everything Under One Roof</h2>
          <p>
            From pitch hire and birthday parties to leagues, gym and cafe —
            book the whole facility, or any part of it, in Maribyrnong.
          </p>
        </div>

        <div className="services-grid">
          {SERVICE_CARDS.map((card, index) => {
            const isOpen = openCard === index;

            return (
              <article
                key={card.title}
                className={`card services-card ${
                  isOpen ? "services-card--open" : ""
                }`}
                onClick={() => toggleCard(index)}
                onKeyDown={(event) => handleCardKey(event, index)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
              >
                <div className="card__header">
                  <span className="card__eyebrow">{card.eyebrow}</span>
                  <h2 className="card__title">{card.title}</h2>
                </div>

                <div className="card__body">
                  <p>{card.body}</p>
                  <ul>
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="services-card__overlay">
                  <div className="services-card__content">
                    <h3 className="services-card__title">{card.title}</h3>
                    <p className="services-card__message">{card.message}</p>

                    <div className="services-card__actions">
                      {card.links.map((link) => (
                        <Link
                          key={link.to + link.label}
                          to={link.to}
                          className={`btn btn--${link.variant}`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}