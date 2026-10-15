import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/contact.css";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";
import { PageHero } from "../components/PageHero";

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
      <PageHero
        eyebrow="CONTACT"
        title="Get in Touch"
        accent="Let's Connect"
        description="Questions about programs, bookings, or trials? Send us a message and our team will respond within 24 hours."
      />

      <section className="login-callout">
        <div className="login-callout__body">
          <h2>Log in to Manage Your Bookings &amp; Sessions</h2>
          <p>
            The contact form is for general enquiries only. To book pitches,
            gym sessions and parties, manage your Academy schedule, or join a
            team — you&apos;ll need to be logged in to your account.
          </p>
        </div>
        <Link to="/" className="login-callout__cta">
          Log in to Your Account →
        </Link>
      </section>

      <section className="contact-layout">
        <div>
          <Card eyebrow="Location" title="Elite Football Centre">
            <div className="card__body">
              <div className="map-container">
                <iframe
                  title="Map to Elite Football, Maribyrnong VIC 3032"
                  src="https://www.google.com/maps?q=Elite%20Football%2C%20Maribyrnong%20VIC%203032&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <address>
                <strong>169 Rosamond Rd, Maribyrnong VIC 3032</strong>

                <table className="hours-table">
                  <tbody>
                    <tr>
                      <th scope="row">
                        <abbr title="Monday to Friday">Mon–Fri</abbr>
                      </th>
                      <td>7am–12am</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <abbr title="Saturday">Sat</abbr>
                      </th>
                      <td>7am–10pm</td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <abbr title="Sunday">Sun</abbr>
                      </th>
                      <td>10am–10pm</td>
                    </tr>
                  </tbody>
                </table>
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

        <div>
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