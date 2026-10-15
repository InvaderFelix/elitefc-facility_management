import "../../App.css";
import { Card } from "../../components/Card";

export function PortalAdmin() {
  return (
    <Card eyebrow="Staff" title="Administration">
      <p className="portal__lede">
        Staff tools live here. This route is gated to members holding the
        Administrator or Team Manager role.
      </p>
    </Card>
  );
}
