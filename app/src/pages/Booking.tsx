import "../styles/pages/booking.css";
import { PageHero } from "../components/PageHero";
import { Calendar } from "../components/booking";
import { pitchHireConfig } from "../lib/booking/pitchHireConfig";

export function Booking() {
  return (
    <main className="content">
      <PageHero
        eyebrow="BOOKING"
        title="Pitch"
        accent="Hire"
        description="Public availability for our indoor and outdoor pitches. Pick a date, choose your times and reserve online."
      />

      <section className="booking">
        <Calendar {...pitchHireConfig} />
      </section>
    </main>
  );
}
