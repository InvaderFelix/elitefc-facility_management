import "../styles/pages/home.css";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHero } from "../components/PageHero";
import { TextInput } from "../components/TextInput";

const SPONSORS = Array.from({ length: 12 }, (_, index) => `Sponsor ${index + 1}`);
const MARQUEE_COPIES = 3;

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
            <TextInput
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <TextInput
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

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

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </form>

          <div className="divider" />

          <div className="join">
            New to Elite? &nbsp;
            <Link to="/register">Register Account</Link>
          </div>
        </section>
      </section>

      <div className="sponsors-marquee" role="region" aria-label="Club sponsors">
        <ul className="sponsors-marquee__track">
          {Array.from({ length: MARQUEE_COPIES * SPONSORS.length }, (_, index) => {
            const copy = Math.floor(index / SPONSORS.length);
            const sponsor = SPONSORS[index % SPONSORS.length];

            return (
              <li
                key={`${copy}-${sponsor}`}
                className="sponsor-card"
                aria-hidden={copy > 0 ? true : undefined}
              >
                {sponsor}
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}