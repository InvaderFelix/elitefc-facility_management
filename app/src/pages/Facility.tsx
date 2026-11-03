import { useState, type KeyboardEvent } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { LinkButton } from "../components/LinkButton";
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
            From pitch hire and birthday parties to leagues, gym, and cafe,
            book the whole facility, or any part of it, in Maribyrnong.
          </p>
        </div>

        <div className="services-grid">
          {SERVICE_CARDS.map((card, index) => {
            const isOpen = openCard === index;

            return (
              <Card
                key={card.title}
                className={`services-card ${
                  isOpen ? "services-card--open" : ""
                }`}
                eyebrow={card.eyebrow}
                title={card.title}
                onClick={() => toggleCard(index)}
                onKeyDown={(event) => handleCardKey(event, index)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                overlay={
                  <div className="services-card__overlay">
                    <div className="services-card__content">
                      <h3 className="services-card__title">{card.title}</h3>
                      <p className="services-card__message">{card.message}</p>

                      <div className="services-card__actions">
                        {card.links.map((link) =>
                          link.to ? (
                            <LinkButton
                              key={link.label}
                              to={link.to}
                              variant={link.variant}
                            >
                              {link.label}
                            </LinkButton>
                          ) : (
                            <Button key={link.label} variant={link.variant}>
                              {link.label}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                }
              >
                <p>{card.body}</p>
                <ul>
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}