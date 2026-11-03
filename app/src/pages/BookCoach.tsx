import "../styles/pages/booking.css";
import { PageHero } from "../components/PageHero";
import { Calendar } from "../components/booking";
import { bookingLegendItems, bookingLegendNote } from "../lib/booking";

export function BookCoach() {
  return (
    <main className="content">
      <PageHero eyebrow="BOOKING" title="One to one" accent="Coaching" description="Book a coach session." />
      <section className="booking">
        <Calendar legendItems={bookingLegendItems} legendNote={bookingLegendNote} />
      </section>
    </main>
  );
}
