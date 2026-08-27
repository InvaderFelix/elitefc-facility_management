import { FormEvent, MouseEvent, useState } from "react";
import "./App.css";

function App() {
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

  const handleForgotPassword = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    alert(
      "Demo only — connect this link to your password reset flow."
    );
  };

  return (
    <div className="page">
      <div className="background" />

      <header>
        <div className="logo">
          <div className="logo-mark">E</div>

          <div className="logo-text">
            ELITE FOOTBALL
            <span>ACADEMY • MELBOURNE</span>
          </div>
        </div>

        <nav>
          <a href="#">Academy</a>
          <a href="#">Programs</a>
          <a href="#">Pathway</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">
            Player &amp; Parent Portal
          </div>

          <h1>
            Become
            <span>Elite.</span>
          </h1>

          <p className="hero-description">
            Your football journey starts here. Access your training,
            fixtures, development progress and Academy updates from
            one place.
          </p>

          <div className="stats">
            <div className="stat">
              <strong>01</strong>
              <small>Train</small>
            </div>

            <div className="stat">
              <strong>02</strong>
              <small>Develop</small>
            </div>

            <div className="stat">
              <strong>03</strong>
              <small>Compete</small>
            </div>

            <div className="stat">
              <strong>04</strong>
              <small>Progress</small>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="card-header">
            <div className="card-title">
              Welcome
              <br />
              <span>Back.</span>
            </div>

            <div className="member-badge">
              MEMBER
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">
                Email / Username
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">
                Password
              </label>

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
                <input
                  type="checkbox"
                  id="remember"
                />

                <span>Remember me</span>
              </label>

              <a
                href="#"
                className="forgot"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>
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
            <a href="#">
              Join the Academy →
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div>
          <strong>ELITE FOOTBALL ACADEMY</strong>
          &nbsp; • &nbsp;
          Train. Play. Develop.
        </div>

        <div>
          © 2026 Elite Football Academy
        </div>
      </footer>
    </div>
  );
}

export default App;