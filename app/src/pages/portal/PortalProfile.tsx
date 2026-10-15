import "../../App.css";
import { Card } from "../../components/Card";
import { useAuth } from "../../lib/useAuth";

export function PortalProfile() {
  const { person, user, roles } = useAuth();

  const fullName = person
    ? [person.first_name, person.last_name].filter(Boolean).join(" ")
    : "—";

  return (
    <Card eyebrow="Account" title="Your Profile">
      <dl className="portal__facts">
        <div>
          <dt>Name</dt>
          <dd>{fullName}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user?.email ?? "—"}</dd>
        </div>
        <div>
          <dt>Roles</dt>
          <dd>{roles.length > 0 ? roles.join(", ") : "—"}</dd>
        </div>
      </dl>
    </Card>
  );
}
