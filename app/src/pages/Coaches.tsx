import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../App.css";

interface Coach {
  id: string;
  name: string;
  role: string;
  image?: string;
  specialty: string;
  experience: string;
  bio: string;
}

const COACHES: Coach[] = [
  {
    id: "nikky",
    name: "Nikky Zakoski",
    role: "Football Intelligence · Strength & Conditioning Coach",
    image: "/assets/img/card-nicki.jpg",
    specialty: "Scanning, positioning, decision-making under pressure",
    experience: "Football Intelligence lead",
    bio: "Leads the Football Intelligence side of E360: the part of the game that happens before the ball arrives. Trains players to scan earlier, position themselves smarter and make faster decisions under pressure, so the game slows down for them on match day. As an S&C coach, ties that mental work to the physical so players execute at speed and under fatigue, the way real matches demand it.",
  },
  {
    id: "juan",
    name: "Juan Toro",
    role: "Athlete Performance · Health & Fitness Coach",
    image: "/assets/img/card-juan.jpg",
    specialty: "Strength, conditioning, performance habits",
    experience: "10 years PT studio · Essendon Royals FC S&C since 2019",
    bio: "Transforming lives, one body at a time. Son of a professional soccer player, born in Santiago and raised in Melbourne. Treats the whole person — nutrition, movement, sleep and lifestyle — building sustainable habits rather than quick fixes. Founded and ran his own PT studio in Essendon for ten years and has served as Strength & Conditioning Coach at Essendon Royals FC since 2019.",
  },
  {
    id: "rodrigo",
    name: "Rodrigo Aguilera Leon",
    role: "Football Coach · Player Development",
    image: "/assets/img/card-rodrigo.jpg",
    specialty: "Technique, athleticism, game understanding, mindset",
    experience: "Professional player 2004–2011",
    bio: "Played at a high professional level from 2004 to 2011, and has coached inside Victoria's youth football system since 2019. A qualified PE teacher and sport science coach, he develops players, educates them and builds athletes. Experience includes NPL strength and conditioning at Green Gully, Technical Director of MiniRoos at Westgate FC, and Under 20s at Hume City.",
  },
  {
    id: "valentina",
    name: "Valentina Diaz Quinones",
    role: "Female Performance · Soccer Coach",
    image: "/assets/img/card-valentina.jpg",
    specialty: "Technical & tactical game · attacking play",
    experience: "Professional footballer · Colombia · Brazil · Australia",
    bio: "A professional Colombian footballer who has played competitively in Colombia, Brazil and Australia. Plays mainly as a striker and attacking midfielder, known for her intensity, reading of the game, discipline and commitment. As a current professional following the same pathway, training with her makes the pathway feel more achievable for young female players.",
  },
  {
    id: "jaden",
    name: "Jaden Tran",
    role: "Strength & Conditioning Coach",
    image: "/assets/img/card-jaden.jpg",
    specialty: "Speed, strength, power, injury prevention",
    experience: "Physical platform specialist",
    bio: "Builds the physical platform underneath every player: speed, strength, power and the resilience to handle a full season of high-level football. His programs are age-appropriate and progressive, meeting each player where they are and moving them forward safely. Injury prevention runs through everything, from movement quality screening to load management.",
  },
  {
    id: "agustin",
    name: "Agustin Capalbo",
    role: "Goal Keeper Performance Coach",
    image: "/assets/img/card-agustin.jpg",
    specialty: "Handling, footwork, positioning, shot-stopping",
    experience: "All age groups · First gloves to NPL",
    bio: "Runs specialist goalkeeper coaching at E360, an area most young keepers never get real access to at club level. Sessions cover the full craft: handling, footwork, positioning, shot-stopping, distribution and commanding the box. Works with keepers from a first pair of gloves through to those pushing for NPL football.",
  },
  {
    id: "sebastian",
    name: "Sebastian Bernal",
    role: "Football Coach",
    image: "/assets/img/card-sebastian.jpg",
    specialty: "Technique, confidence, discipline, decision-making",
    experience: "Professional · Colombia · Brazil (7 years) · Bolivia · Australia",
    bio: "A professional player with experience in Colombia, Brazil, where he played professionally for seven years, Bolivia and now Australia. Passionate about developing players who are technically strong with a great understanding of the game. Creates a positive environment where players improve on and off the pitch.",
  },
  {
    id: "matias",
    name: "Matias Contreras",
    role: "Football Coach",
    image: "/assets/img/card-matias.jpg",
    specialty: "Technical foundations & game understanding",
    experience: "Elite FC U11 · U12/13 Girls · U8",
    bio: "Builds technical foundations and game understanding session by session. Focuses on clean execution of the basics, then layers in decision-making so players know not just how to perform an action, but when and why. Coaches the U11 Kangaroos, the U12/13 Girls Kangaroos and the U8 Wallabies across the junior pathway.",
  },
];

const ORDERED_IDS = [
  "rodrigo",
  "matias",
  "valentina",
  "agustin",
  "jaden",
  "sebastian",
  "juan",
  "nikky",
];

const COACHES_BY_ID: Record<string, Coach> = Object.fromEntries(
  COACHES.map((coach) => [coach.id, coach]),
);

const renderName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ");

  return (
    <>
      {first && <span className="coach-name__first">{first}</span>}
      {last && <span className="coach-name__last"> {last}</span>}
    </>
  );
};

export function Coaches() {
  const [selected, setSelected] = useState<Coach | null>(null);
  const [open, setOpen] = useState(false);

  const openLightbox = (coach: Coach) => {
    setSelected(coach);
    setOpen(true);
  };

  const closeLightbox = () => {
    setOpen(false);
    window.setTimeout(() => setSelected(null), 250);
  };

  const navigate = useCallback(
    (step: number) => {
      if (!selected) return;

      const current = ORDERED_IDS.indexOf(selected.id);
      if (current === -1) return;

      const next = (current + step + ORDERED_IDS.length) % ORDERED_IDS.length;
      setSelected(COACHES_BY_ID[ORDERED_IDS[next]]);
    },
    [selected],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, selected, navigate]);

  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">COACHES</div>

        <h1>
          Master
          <span>Educators</span>
        </h1>

        <p className="hero-description">
          Meet the coaches driving player development across our programs.
          Each brings unique expertise to accelerate your football journey.
        </p>
      </section>

      <section className="cards-grid">
        {ORDERED_IDS.map((id) => {
          const coach = COACHES_BY_ID[id];
          if (!coach) return null;

          return (
            <button
              type="button"
              className="coach-tile"
              key={coach.id}
              onClick={() => openLightbox(coach)}
            >
              {coach.image ? (
                <img
                  src={coach.image}
                  alt={`${coach.name} portrait`}
                  className="coach-tile__img"
                />
              ) : (
                <span
                  className="coach-tile__img coach-tile__img--placeholder"
                  aria-hidden="true"
                >
                  {coach.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}

              <span className="coach-tile__open" aria-hidden="true">
                View
              </span>

              <span className="coach-tile__label">
                <span className="coach-name">{renderName(coach.name)}</span>
                <span className="coach-role">{coach.role}</span>
              </span>
            </button>
          );
        })}
      </section>

      {selected &&
        createPortal(
          <div
            className={`coach-lightbox${open ? " coach-lightbox--open" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.name} profile`}
            onClick={closeLightbox}
          >
            <div className="coach-lightbox__panel">
              <div
                className="coach-lightbox__photo"
                key={`${selected.id}-photo`}
              >
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={`${selected.name} portrait`}
                    className="coach-lightbox__img"
                  />
                ) : (
                  <div
                    className="coach-lightbox__img coach-lightbox__img--placeholder"
                    aria-hidden="true"
                  >
                    {selected.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="coach-lightbox__close"
                aria-label="Close"
                onClick={closeLightbox}
              >
                ✕
              </button>

              <div
                className="coach-lightbox__meta"
                key={`${selected.id}-meta`}
              >
                <span className="coach-name">{renderName(selected.name)}</span>
                <span className="coach-role">{selected.role}</span>

                <div className="coach-lightbox__divider" />

                <strong className="coach-lightbox__specialty">
                  {selected.specialty}
                </strong>
                <p className="coach-lightbox__experience">
                  {selected.experience}
                </p>
                <p className="coach-lightbox__bio">{selected.bio}</p>
              </div>
            </div>

            <button
              type="button"
              className="coach-lightbox__nav coach-lightbox__nav--prev"
              aria-label="Previous coach"
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
            >
              ‹
            </button>

            <button
              type="button"
              className="coach-lightbox__nav coach-lightbox__nav--next"
              aria-label="Next coach"
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
            >
              ›
            </button>
          </div>,
          document.body,
        )}
    </main>
  );
}