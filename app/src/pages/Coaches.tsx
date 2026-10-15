import { useCallback, useEffect, useState } from "react";
import "../styles/pages/coaches.css";
import { PageHero } from "../components/PageHero";
import { Lightbox } from "../components/Lightbox";
import { COACHES_BY_ID, ORDERED_IDS, type Coach } from "../data/coaches";

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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") navigate(-1);
      if (event.key === "ArrowRight") navigate(1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, navigate]);

  return (
    <main className="content">
      <PageHero
        eyebrow="COACHES"
        title="Master"
        accent="Educators"
        description="Meet the coaches driving player development across our programs. Each brings unique expertise to accelerate your football journey."
      />

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

      {selected && (
        <Lightbox
          variant="coach-lightbox"
          open={open}
          onClose={closeLightbox}
          ariaLabel={`${selected.name} profile`}
          nav={
            <>
              <button
                type="button"
                className="coach-lightbox__nav coach-lightbox__nav--prev"
                aria-label="Previous coach"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(-1);
                }}
              >
                ‹
              </button>

              <button
                type="button"
                className="coach-lightbox__nav coach-lightbox__nav--next"
                aria-label="Next coach"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(1);
                }}
              >
                ›
              </button>
            </>
          }
        >
          <div className="coach-lightbox__photo" key={`${selected.id}-photo`}>
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

          <div className="coach-lightbox__meta" key={`${selected.id}-meta`}>
            <span className="coach-name">{renderName(selected.name)}</span>
            <span className="coach-role">{selected.role}</span>

            <div className="coach-lightbox__divider" />

            <strong className="coach-lightbox__specialty">
              {selected.specialty}
            </strong>
            <p className="coach-lightbox__experience">{selected.experience}</p>
            <p className="coach-lightbox__bio">{selected.bio}</p>
          </div>
        </Lightbox>
      )}
    </main>
  );
}
