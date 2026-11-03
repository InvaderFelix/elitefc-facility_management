import "../styles/pages/booking.css";
import { PageHero } from "../components/PageHero";
import { Calendar } from "../components/booking";
import { bookingLegendItems, bookingLegendNote } from "../lib/booking";

export function BookParty() {
  return (
    <main className="content">
      <PageHero eyebrow="BOOKING" title="Birthday" accent="Party" description="Book a party at Elite Football Centre." />
      <section className="booking">
        <Calendar legendItems={bookingLegendItems} legendNote={bookingLegendNote} />
      </section>
    </main>
  );
}
