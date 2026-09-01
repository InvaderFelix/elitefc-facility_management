import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export function Home() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      alert(
        "Demo only — connect this form to your authentication system."
      );
    }, 800);
  };

  return (
    <main className="content">
      <section className="hero-split">
        <section className="hero">
          <div className="eyebrow">Player &amp; Parent Portal</div>

          <h1>
            Become
            <span>Elite</span>
          </h1>

          <p className="hero-description">
            Your football journey starts here. Access your training, fixtures,
            development progress and Academy updates from one place.
          </p>

          <div className="stats">
            <div className="stat">
              <strong>01</strong>
              <small>Login</small>
            </div>
            <div className="stat">
              <strong>02</strong>
              <small>Play</small>
            </div>
            <div className="stat">
              <strong>03</strong>
              <small>Connect</small>
            </div>
            <div className="stat">
              <strong>04</strong>
              <small>Compete</small>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="card-header">
            <div className="card-title">
              Welcome
              <br />
              <span>Back</span>
            </div>

            <div className="member-badge">MEMBER</div>
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

            <button
              type="submit"
              className="login-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>

          <div className="divider" />

          <div className="join">
            New to Elite? &nbsp;
            <Link to="/academy">Join the Academy →</Link>
          </div>
        </section>
      </section>
    </main>
  );
}