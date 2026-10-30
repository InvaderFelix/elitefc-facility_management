import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { PageHero } from "../components/PageHero";
import {
  AUSTRALIA_STALL,
  FAQS,
  GAP_STATS,
  PROGRAMS,
} from "../data/elite360";

export function Elite360() {
  return (
    <main className="content">
      <PageHero
        eyebrow={<span style={{ color: "var(--elite360-green)" }}>Elite360</span> as any}
        title="Professional Athlete"
        accent="Development"
        description="Elite performance coaching from U13 to U18 — and beyond. Full-time and part-time programs built to develop talented footballers on their pathway to the top."
      />

      <section className="academy-services">
        <div className="card">
          <div className="section-heading">
            <h2>The Gap <span className="elite360-green">Elite360</span> Is Built to Close</h2>
            <p>
              Australian football has a well-documented problem: kids are
              selected early on the wrong signals, then stall exactly when it
              matters most. The talent isn't the issue — the pathway above U14
              is.
            </p>
          </div>

          <div className="stats">
            {GAP_STATS.map((stat) => (
              <div className="stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="academy-services">
        <div className="section-heading">
          <div className="eyebrow">YOUR PATHWAY TO SENIOR FOOTBALL</div>
          <h2>Two Programs. One Pathway.</h2>
          <p>
            <span className="elite360-green">Elite360</span> is for talented footballers on their pathway to the top. Available to
            U13 players through senior players looking for more — book your
            assessment and start the journey today.
          </p>
        </div>

        <div className="cards-grid">
          {PROGRAMS.map((program) => (
            <details className="program-panel" key={program.id}>
              <summary>
                <span className="program-title">{program.title}</span>
                <span className="program-age">{program.tag}</span>
                <span className="program-chevron" aria-hidden="true">
                  +
                </span>
              </summary>

              <div className="program-content">
                <p>{program.description}</p>

                <p className="program-entry">{program.pricing}</p>

                <Card eyebrow="What's Included" title="Inside the Program">
                  <div className="card__body">
                    <ul>
                      {program.included.map((item) => (
                        <li key={item.title}>
                          <strong>{item.title}</strong>
                          <br />
                          {item.body}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                <p className="program-entry">{program.forWhom}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="academy-services">
        <div className="section-heading">
          <div className="eyebrow">FAQ</div>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq">
          {FAQS.map((faq) => (
            <div className="faq__item" key={faq.id}>
              <h3 className="faq__question">{faq.question}</h3>
              <p className="faq__answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="login-callout">
        <div className="login-callout__body">
          <div className="login-callout__kicker">READY TO TRAIN</div>
          <h2>Book Your Free Trial and Start Your Pathway to Senior Football</h2>
          <p>
            Book your assessment and start the journey today — email{" "}
            <a href="mailto:bookings@elitefootballcentre.com.au">
              bookings@elitefootballcentre.com.au
            </a>{" "}
            or call <a href="tel:0413208605">0413 208 605</a>.
          </p>
        </div>
        <Link to="/contact" className="login-callout__cta">
          Enquire Now →
        </Link>
      </section>

      <section className="academy-services">
        <div className="section-heading">

        </div>

        <Card eyebrow="PLAYERS STALL BETWEEN 16 AND 19" title="In Australia Specifically">
          <div className="card__body">
            <p>
              Coaches and former internationals broadly agree Australian 15- to
              16-year-olds match European peers technically, then diverge. The
              data backs it up:
            </p>
            <ul>
              {AUSTRALIA_STALL.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </main>
  );
}