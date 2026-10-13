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

interface AgeGroup {
  id: string;
  title: string;
  ageRange: string;
  description: string;
  focus: string[];
  entryRequirements?: string;
}

const AGE_GROUPS: AgeGroup[] = [
  {
    id: "1",
    title: "Petite",
    ageRange: "Ages 3 to 5",
    description:
      "Petite is where the Elite FC pathway begins. Built for our youngest players, sessions are all about fun, movement and falling in love with the ball.",
    focus: [
      "Fun, movement and first touch",
      "Coordination, balance and confidence",
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
      "Dribbling, passing, first touch and game sense",
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
      "Academy is Elite FC's MiniRoos program. Small-sided football means more touches, more decisions and more time on the ball — delivered with a real curriculum.",
    focus: [
      "MiniRoos small-sided football",
      "Qualified coaches and development curriculum",
      "Moonee Valley Knights FC partnership for Football Victoria competition",
      "Pathway to Juniors, Seniors and E360 / NPL",
      "National tournaments and international tour opportunities",
    ],
  },
  {
    id: "4",
    title: "Elite 360",
    ageRange: "Ages 13 to 18",
    description:
      "Elite high-performance program for advanced players seeking professional pathways.",
    focus: [
      "Elite technical training",
      "Strength & conditioning",
      "Mental performance",
      "Competitive match play",
    ],
    entryRequirements:
      "Trial and selection required. Partnership with Moonee Valley Knights FC.",
  },
];

export function Academy() {
  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">ACADEMY</div>

        <h1>
          Player Development
          <span>Pathway</span>
        </h1>

        <p className="hero-description">
          Petite, Pre-Academy, and Academy — a defined pathway from first touch to competitive football.
        </p>
      </section>

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
