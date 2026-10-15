import { Card } from "../components/Card";
import { PageHero } from "../components/PageHero";
import { AGE_GROUPS, EXPLAINERS } from "../data/academy";

export function Academy() {
  return (
    <main className="content">
      <PageHero
        eyebrow="ACADEMY"
        title="Player Development"
        accent="Pathway"
        description="Petite, Pre-Academy, and Academy — a defined pathway from first touch to competitive football."
      />

      <section className="academy-services">
        <div className="section-heading">
          <div className="eyebrow">DEVELOPMENT PATHWAYS</div>
          <h2>Find the Right Stage</h2>
          <p>
            Structured pathways from first touch to high-performance football,
            aligned with Elite Football Centre's programs.
          </p>
        </div>

        <div className="cards-grid">
          {AGE_GROUPS.map((group) => (
            <details className="program-panel" key={group.id}>
              <summary>
                <span className="program-title">{group.title}</span>
                <span className="program-age">{group.ageRange}</span>
                <span className="program-chevron" aria-hidden="true">
                  +
                </span>
              </summary>

              <div className="program-content">
                <p>{group.description}</p>

                <ul>
                  {group.focus.map((focus) => (
                    <li key={focus}>{focus}</li>
                  ))}
                </ul>

                {group.entryRequirements && (
                  <p className="program-entry">{group.entryRequirements}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="cards-grid">
        {EXPLAINERS.map((explainer) => (
          <Card
            key={explainer.id}
            title={explainer.title}
            eyebrow={explainer.ageGroup}
          >
            <div className="card__body">
              <div className="video-placeholder">
                <iframe
                  width="100%"
                  height="180"
                  src={`https://www.youtube.com/embed/${explainer.videoId}?rel=0&controls=1`}
                  title={explainer.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <h3 className="explainer-title">{explainer.title}</h3>

              <p className="explainer-desc">{explainer.description}</p>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
