import "../../App.css";
import { Card } from "../../components/Card";

export function PortalBookings() {
  return (
    <Card eyebrow="Bookings" title="Your Bookings">
      <p className="portal__lede">No bookings yet.</p>
    </Card>
  );
}
