import "../../App.css";
import { Card } from "../../components/Card";

export function PortalHome() {
  return (
    <Card eyebrow="Overview" title="Your Dashboard">
      <p className="portal__lede">
        Welcome to your portal. Training, fixtures, registrations and account
        details will surface here as the Academy systems come online.
      </p>
    </Card>
  );
}
