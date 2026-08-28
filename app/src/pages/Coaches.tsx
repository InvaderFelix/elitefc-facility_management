import "../App.css";

interface Coach {
  id: string;
  name: string;
  role: string;
  image: string;
  specialty: string;
  experience: string;
  bio: string;
}

const COACHES: Coach[] = [
  {
    id: "1",
    name: "Nikky Zakoski",
    role: "Football Intelligence & S&C Coach",
    image: "/assets/img/card-nicki.jpg",
    specialty: "Scanning, positioning, decision-making under pressure",
    experience: "10+ years elite youth development",
    bio: "Specializes in football intelligence and physical development. Trains players to read the game faster through scanning exercises and positioning drills.",
  },
  {
    id: "2",
    name: "Juan Toro",
    role: "Athlete Performance S&C Coach",
    image: "/assets/img/card-juan.jpg",
    specialty: "Strength, conditioning, performance habits",
    experience: "8 years professional sport S&C",
    bio: "Builds the engine behind performance. Develops strength, conditioning and the habits that keep players improving consistently.",
  },
  {
    id: "3",
    name: "Rodrigo Aguilera",
    role: "Player Development Coach",
    image: "/assets/img/card-rodrigo.jpg",
    specialty: "Technique, athleticism, game understanding",
    experience: "Professional player 2004-2011",
    bio: "Former professional player developing young footballers across Victoria. Works on technique, athleticism, game understanding and mindset.",
  },
];

export function Coaches() {
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
        {COACHES.map((coach) => (
          <details className="coach-panel" key={coach.id}>
            <summary className="coach-summary">
              <span className="coach-name">{coach.name}</span>
              <span className="coach-role">{coach.role}</span>
              <span className="coach-chevron" aria-hidden="true">
                +
              </span>
            </summary>

            <div className="coach-content">
              <img
                src={coach.image}
                alt={`${coach.name} portrait`}
                className="coach-image"
              />

              <div className="coach-meta">
                <strong>{coach.specialty}</strong>
                <p className="coach-experience">{coach.experience}</p>
                <p className="coach-bio">{coach.bio}</p>
              </div>
            </div>
          </details>
        ))}
      </section>
    </main>
  );
}