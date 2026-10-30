import { PageHero } from "../components/PageHero";

export function BookParty() {
  return (
    <main className="content">
      <PageHero eyebrow="BOOKING" title="Birthday Party" accent="" description="Book a party at Elite Football Centre." />
      <section className="section">
        <div className="container">
          <p>How Booking Works: Please contact us to arrange your party booking.</p>
        </div>
      </section>
    </main>
  );
}
