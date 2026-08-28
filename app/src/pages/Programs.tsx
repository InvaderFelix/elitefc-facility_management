import "../App.css";

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
    ageRange: "Ages 4-6",
    description:
      "Introduction to football fundamentals through fun, engaging activities.",
    focus: ["Basic ball mastery", "Coordination games", "Fun competitions"],
    entryRequirements: "No experience necessary. Focus on enjoyment and movement.",
  },
  {
    id: "2",
    title: "Pre-Academy",
    ageRange: "Ages 7-9",
    description:
      "Development phase focusing on technical skills and game understanding.",
    focus: [
      "First touch and passing",
      "1v1 situations",
      "Basic tactics and positioning",
    ],
    entryRequirements: "Completion of Petite or equivalent experience.",
  },
  {
    id: "3",
    title: "Academy",
    ageRange: "Ages 10-12",
    description:
      "Structured development program with tactical awareness and physical progression.",
    focus: [
      "Technical refinement",
      "Tactical understanding",
      "Physical development",
    ],
    entryRequirements: "Selection process or graduate from Pre-Academy.",
  },
  {
    id: "4",
    title: "E360 (High Performance)",
    ageRange: "Ages 13-18",
    description:
      "Elite high-performance program for advanced players seeking professional pathways.",
    focus: [
      "Elite technical training",
      "Strength & conditioning",
      "Mental performance",
      "Competitive match play",
    ],
    entryRequirements: "Trial and selection required. Partnership with Moonee Valley Knights FC.",
  },
];

export function Programs() {
  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">PROGRAMS</div>

        <h1>
          Development
          <span>Pathways</span>
        </h1>

        <p className="hero-description">
          Find the right program for your player&apos;s age and skill level.
          Structured pathways from first touch to high-performance elite
          football.
        </p>
      </section>

      <section className="cards-grid">
        {AGE_GROUPS.map((group) => (
          <details className="program-panel" key={group.id}>
            <summary className="program-summary">
              <span className="program-title">{group.title}</span>
              <span className="program-age">{group.ageRange}</span>
              <span className="program-chevron" aria-hidden="true">
                +
              </span>
            </summary>

            <div className="program-content">
              <p className="program-description">{group.description}</p>

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
      </section>
    </main>
  );
}