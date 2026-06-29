const principles = [
  "User-owned reputation",
  "Portable trading history",
  "Verifiable event records"
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="home-heading">
        <p className="eyebrow">TrustLayer MVP foundation</p>
        <h1 id="home-heading">Reputation belongs to people, not platforms.</h1>
        <p className="intro">
          TrustLayer is a decentralized reputation infrastructure for
          peer-to-peer trading. This bootstrap keeps the product surface small
          while the core system is assembled.
        </p>
        <div className="principles" aria-label="TrustLayer principles">
          {principles.map((principle) => (
            <span key={principle}>{principle}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
