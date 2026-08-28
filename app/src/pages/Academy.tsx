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
            Player Development
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
              Welcome Back
              <br />
              <span>Academy Access</span>
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
                  <li>Cancellations within 24hrs incur a fee</li>
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