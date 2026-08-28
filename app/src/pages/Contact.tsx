import { useState, type FormEvent } from "react";
import "../App.css";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      alert(
        "Thank you! Your message has been sent to bookings@elitefootballcentre.com.au"
      );
    }, 1200);
  };

  return (
    <main className="content">
      <section className="hero">
        <div className="eyebrow">CONTACT</div>

        <h1>
          Get in Touch
          <span>Let&apos;s Connect</span>
        </h1>

        <p className="hero-description">
          Questions about programs, bookings, or trials? Send us a message and
          our team will respond within 24 hours.
        </p>
      </section>

      <section className="contact-layout">
        <div className="map-section">
          <Card eyebrow="Location" title="Elite Football Centre">
            <div className="card__body">
              <div className="map-container">
                <div className="map-box">
                  <div className="map-icon" aria-hidden="true">
                    📍
                  </div>

                  <h4>169 Rosamond Road</h4>
                  <p>Maribyrnong VIC 3032</p>
                  <p>Melbourne&apos;s western suburbs</p>
                </div>
              </div>

              <address>
                <strong>169 Rosamond Rd, Maribyrnong VIC 3032</strong>
                <br />
                <abbr title="Monday to Friday">Mon–Fri</abbr>: 7am–12am
                <br />
                <abbr title="Saturday">Sat</abbr>: 7am–10pm
                <br />
                <abbr title="Sunday">Sun</abbr>: 10am–10pm
              </address>

              <div className="contact-details">
                <p>
                  <a href="tel:0413208605">0413 208 605</a>
                  <span> · Facility</span>
                </p>
                <p>
                  <a href="tel:0478920823">0478 920 823</a>
                  <span> · Elite FC</span>
                </p>
                <p>
                  <a href="mailto:bookings@elitefootballcentre.com.au">
                    bookings@elitefootballcentre.com.au
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="form-section">
          <Card eyebrow="Message" title="Send Us a Message">
            <div className="card__body">
              <form onSubmit={handleSubmit} noValidate>
                <TextInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                />

                <TextInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />

                <TextInput
                  label="Phone (optional)"
                  name="phone"
                  type="tel"
                  placeholder="+61 413 208 605"
                />

                <TextInput
                  label="Subject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Trial request, Program enquiry"
                  required
                />

                <TextInput
                  label="Message"
                  name="message"
                  placeholder="Tell us about your query..."
                  required
                />

                <div className="form-options">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={submitting}
                  >
                    {submitting ? "SENDING..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}