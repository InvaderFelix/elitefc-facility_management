import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { Card } from "../components/Card";

export function Academy() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <main className="content">
      <section className="hero-split">
        <section className="hero">
          <div className="eyebrow">ACADEMY</div>

          <h1>
            Local Facility
            <span>Elite Training</span>
          </h1>

          <p className="hero-description">
            Structured training programs for players aged 7-18. Technical
            development, tactical awareness, and physical progression in a
            purpose-built facility.
          </p>
        </section>

        <section className="login-card">
          <div className="card-header">
            <div className="card-title">
              Academy
              <br />
              <span>One Login Access</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email / Username</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" id="remember" />
                <span>Remember me</span>
              </label>

              <Link to="/contact" className="forgot">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-button">
              LOG IN
            </button>
          </form>

          <div className="divider" />

          <div className="join">
            New to Elite? &nbsp;
            <Link to="/academy">Join the Academy →</Link>
          </div>
        </section>
      </section>

      <section className="academy-services">
        <div className="section-heading">
          <div className="eyebrow">FACILITY SERVICES</div>
          <h2>Everything Under One Roof</h2>
          <p>
            From pitch hire and birthday parties to leagues, gym and cafe —
            book the whole facility, or any part of it, in Maribyrnong.
          </p>
        </div>

        <div className="services-grid">
          <Card eyebrow="Book Courts" title="Pitch Hire">
            <div className="card__body">
              <p className="muted">
                FIFA-grade indoor and outdoor pitches, open 7 days.
              </p>
              <ul>
                <li>Indoor 7-a-side — $240 per hour</li>
                <li>Indoor 5-a-side — $120 per hour</li>
                <li>Outdoor 5-a-side — $110 per hour</li>
              </ul>
            </div>
          </Card>

          <Card eyebrow="Weekends" title="Birthday Parties">
            <div className="card__body">
              <p className="muted">
                Exclusive pitch use, a dedicated party area and our licensed
                cafe make party day easy.
              </p>
              <ul>
                <li>Saturdays & Sundays</li>
                <li>Party food packages available</li>
              </ul>
            </div>
          </Card>

          <Card eyebrow="Members" title="Gym Access">
            <div className="card__body">
              <p className="muted">
                A fully equipped strength and conditioning space built for
                footballers.
              </p>
              <ul>
                <li>Performance gym</li>
                <li>Bookable for your own training</li>
              </ul>
            </div>
          </Card>

          <Card eyebrow="Competition" title="Leagues">
            <div className="card__body">
              <p className="muted">
                Social and competitive football, all year round.
              </p>
              <ul>
                <li>Adult League — Monday 7-a-side social · Tuesday intermediate</li>
                <li>Junior League — ESL summer competition</li>
                <li>Fixtures, results & replays published live</li>
              </ul>
            </div>
          </Card>

          <Card eyebrow="All Week" title="Cafe & Licensed Bar">
            <div className="card__body">
              <p className="muted">
                Coffee, food and licensed bar for players, parents and
                spectators.
              </p>
              <ul>
                <li>Monday–Friday 8am–8pm</li>
                <li>Saturday–Sunday 8am–9pm</li>
              </ul>
            </div>
          </Card>

          <Card eyebrow="Events" title="Venue Hire">
            <div className="card__body">
              <p className="muted">
                Hire the whole venue or any part of it for corporate events,
                schools, tournaments and functions.
              </p>
              <ul>
                <li>Change rooms & amenities</li>
                <li>Free on-site parking</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {isLoggedIn && (
        <section className="booking-info">
          <Card eyebrow="Bookings" title="Facility Bookings">
            <div className="card__body">
              <p className="muted">
                Book courts, gym sessions, and pitch bookings through the
                member portal. Select your preferred date, time, and session
                type below.
              </p>

              <details>
                <summary>Available Facilities</summary>
                <ul>
                  <li>Senior Pitch (Full-size)</li>
                  <li>Junior Pitch (MiniRoos)</li>
                  <li>Gym Area</li>
                  <li>Indoor Training Zone</li>
                </ul>
              </details>

              <details>
                <summary>Booking Rules</summary>
                <ul>
                  <li>Members must be logged in to book</li>
                  <li>Cancellations within 24 hours incur a fee</li>
                  <li>Peak times subject to availability</li>
                </ul>
              </details>
            </div>
          </Card>

          <Card eyebrow="Schedule" title="Training Schedule">
            <div className="card__body">
              <p className="muted">
                View and manage your player&apos;s training sessions and match
                fixtures throughout the season.
              </p>

              <ul>
                <li>Weekly skill sessions</li>
                <li>Match day rotations</li>
                <li>Goalkeeper-specific training</li>
                <li>Fitness and conditioning</li>
              </ul>
            </div>
          </Card>
        </section>
      )}
    </main>
  );
}