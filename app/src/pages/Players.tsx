import "../App.css";
import { Card } from "../components/Card";

interface PlayerExplainer {
  id: string;
  title: string;
  description: string;
  videoId: string;
  ageGroup: string;
}

const EXPLAINERS: PlayerExplainer[] = [
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

export function Players() {
  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">PLAYERS</div>

        <h1>
          Player Development
          <span>Resources</span>
        </h1>

        <p className="hero-description">
          Video explainers and guides to support your training journey.
          Watch, learn, and practice at home or on the pitch.
        </p>
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