import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { SERVICE_CARDS } from "../data/facility";

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
        <PageHero
          eyebrow="FACILITY"
          title="Local Facility"
          accent="Elite Training"
          description="Structured training programs for players aged 7 to 18. Technical development, tactical awareness, and physical progression in a purpose-built facility."
        />
      </section>

      <section className="academy-services">
        <div className="section-heading">
          <div className="eyebrow">FACILITY SERVICES</div>
          <h2>Everything Under One Roof</h2>
          <p>
            From pitch hire and birthday parties to leagues, gym, and cafe —
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