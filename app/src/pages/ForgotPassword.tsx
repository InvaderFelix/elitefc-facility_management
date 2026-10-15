import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHero } from "../components/PageHero";
import { getSupabase } from "../lib/supabase";

export function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();

    if (!email) {
      setError("Enter the email address on your account.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError(
        "Password reset isn't available yet — authentication is still being configured.",
      );
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` },
      );

      if (resetError) {
        setError(
          "We couldn't send the reset email right now. Please try again in a moment.",
        );
        return;
      }

      setSentTo(email);
    } catch {
      setError(
        "We couldn't reach the server. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="content">
      <PageHero
        eyebrow="ACCOUNT RECOVERY"
        title="Forgot Your"
        accent="Password"
        description="Enter the email address on your account and we'll send you a secure link to set a new password."
      />

      <section className="register-layout">
        <Card eyebrow="Reset Password" title="Request a Reset Link">
          <div className="card__body">
            {sentTo ? (
              <p className="register-success">
                If an account exists for {sentTo}, a reset link is on its way.
                Check your inbox — the link expires after a short time.
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <TextInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

                <ErrorMessage>{error}</ErrorMessage>

                <div className="form-options form-options--spaced">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={submitting}
                  >
                    {submitting ? "SENDING LINK..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>

        <div className="divider" />

        <div className="join">
          Remember your password? &nbsp;
          <Link to="/">Log in</Link>
        </div>

        <div className="join">
          New to Elite? &nbsp;
          <Link to="/register">Join the Academy →</Link>
        </div>
      </section>
    </main>
  );
}
