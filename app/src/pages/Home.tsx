import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHero } from "../components/PageHero";

export function Home() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    // remember checkbox intentionally not used (persistSession default)

    const supabase = getSupabase();
    if (!supabase) {
      setError("Authentication is not configured yet.");
      return;
    }

    setError("");
    setIsLoggingIn(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        return;
      }

      navigate("/academy");
    } catch {
      setError("We couldn't sign you in. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="content">
      <img
        src="/assets/img/logo-white.png"
        alt="Elite Football Academy"
        className="home-logo"
      />

      <section className="hero-split">
        <PageHero
          eyebrow="Player & Parent Portal"
          title="Become"
          accent="Elite"
          description="Your football journey starts here. Access your training, fixtures, development progress, and Academy updates from one place."
        >
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
        </PageHero>

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
              <label htmlFor="email">Email</label>
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

              <Link to="/forgot-password" className="forgot">
                Forgot password?
              </Link>
            </div>

            <ErrorMessage>{error}</ErrorMessage>

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
            <Link to="/register">Register Account</Link>
          </div>
        </section>
      </section>
    </main>
  );
}