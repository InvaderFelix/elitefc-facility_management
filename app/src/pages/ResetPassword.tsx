import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { TextInput } from "../components/TextInput";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHero } from "../components/PageHero";
import { getSupabase } from "../lib/supabase";

type LinkStatus = "checking" | "ready" | "expired" | "unavailable";

export function ResetPassword() {
  const [linkStatus, setLinkStatus] = useState<LinkStatus>(() =>
    getSupabase() ? "checking" : "unavailable",
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    let cancelled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setLinkStatus("ready");
      }
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setLinkStatus(data.session ? "ready" : "expired");
      })
      .catch(() => {
        if (!cancelled) setLinkStatus("expired");
      });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }

    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError(
        "Password reset isn't available yet, authentication is still being configured.",
      );
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(
          updateError.message.includes("different")
            ? "Choose a password you haven't used before."
            : "We couldn't update your password. Please try again.",
        );
        return;
      }

      setDone(true);
      window.setTimeout(() => navigate("/"), 2000);
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
        title="Set a New"
        accent="Password"
        description="Choose a new password for your Elite account. You'll be signed in once it's been saved."
      />

      <section className="register-layout">
        <Card eyebrow="Reset Password" title="Choose a New Password">
          {linkStatus === "checking" && (
            <p className="register-success">
              Checking your reset link...
            </p>
          )}

          {linkStatus === "unavailable" && (
            <ErrorMessage>
              Password reset isn&apos;t available yet, authentication is
              still being configured.
            </ErrorMessage>
          )}

          {linkStatus === "expired" && (
            <ErrorMessage>
              This reset link is invalid or has expired. Request a new one
              to try again.
            </ErrorMessage>
          )}

          {linkStatus === "ready" && !done && (
            <form onSubmit={handleSubmit} noValidate>
              <TextInput
                label="New Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />

              <TextInput
                label="Confirm Password"
                name="confirm"
                type="password"
                placeholder="Repeat the new password"
                autoComplete="new-password"
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
                  {submitting ? "SAVING..." : "Save New Password"}
                </Button>
              </div>
            </form>
          )}

          {done && (
            <p className="register-success">
              Password updated. Taking you back to the login page...
            </p>
          )}
        </Card>

        <div className="divider" />

        <div className="join">
          Link expired? &nbsp;
          <Link to="/forgot-password">Request a new one</Link>
        </div>

        <div className="join">
          Remember your password? &nbsp;
          <Link to="/">Log in</Link>
        </div>
      </section>
    </main>
  );
}
