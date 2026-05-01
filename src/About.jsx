import React from "react";
import { SiteNav } from "./App";

const HOME_PATH = "/";
const ABOUT_PATH = "/about";

const milestones = [
  {
    year: "1998",
    title: "The beginning",
    text: "Akalwadi Associates is founded in Dharwad with a vision to supply quality FMCG essentials to local retailers."
  },
  {
    year: "2005",
    title: "Expanding categories",
    text: "Edible oils, spices and toiletries become the core focus, supplying brands trusted by households every day."
  },
  {
    year: "2015",
    title: "Trusted network",
    text: "Hundreds of retail partners across the region rely on consistent stock and reliable delivery."
  },
  {
    year: "Today",
    title: "Modernising supply",
    text: "Continuing the same family-run trust with smoother ordering, faster fulfilment and a digital-first wholesaler experience."
  }
];

const values = [
  {
    icon: "🤝",
    title: "Trust First",
    text: "Decades of relationships built on honesty, fair pricing and dependable supply."
  },
  {
    icon: "📦",
    title: "Consistent Stock",
    text: "We keep retailers stocked with what their customers actually buy — every single day."
  },
  {
    icon: "🚚",
    title: "Timely Delivery",
    text: "Efficient distribution across Dharwad and surrounding markets, on the schedule you depend on."
  },
  {
    icon: "💬",
    title: "Personal Service",
    text: "A real team that knows your store, picks up the phone and helps you stock smarter."
  }
];

export default function About({ onNavigate }) {
  const navigate = onNavigate || (() => {});

  return (
    <div className="page-shell about-page">
      <header className="about-hero">
        <SiteNav onNavigate={navigate} currentPath={ABOUT_PATH} />

        <div className="about-hero-content">
          <p className="eyebrow">Our Story</p>
          <h1>A Dharwad name in wholesale, since 1998.</h1>
          <p className="about-hero-lead">
            Akalwadi Associates has grown from a small wholesale operation
            into a trusted distribution partner for retailers across the
            region — quietly keeping shelves stocked for over 27 years.
          </p>
        </div>
      </header>

      <main className="about-main">
        <section className="about-photo-section">
          <figure className="about-photo-figure">
            <img
              className="about-photo"
              src="/akalwadi-sign.jpg"
              alt="Akalwadi Associates signboard at the storefront"
            />
            <figcaption>Our storefront in Dharwad, Karnataka.</figcaption>
          </figure>
        </section>

        <section className="about-story">
          <div className="about-story-block">
            <h2>Who We Are</h2>
            <p>
              Akalwadi Associates was established in 1998 with the vision of
              providing quality FMCG products to retailers and businesses.
              Over the years, the company has grown into a trusted wholesaler
              and distributor supplying a wide range of essential products
              including edible oil, spices, and toiletries.
            </p>
            <p>
              With decades of experience in the wholesale market, Akalwadi
              Associates has built strong relationships with suppliers and
              retailers, ensuring consistent product availability and
              reliable service.
            </p>
            <p>
              Our commitment to reliability, timely delivery, and long-term
              partnerships has helped us serve numerous retail stores and
              businesses. We continue to expand our network and improve our
              services to meet the evolving demands of the FMCG market.
            </p>
          </div>
        </section>

        <section className="about-values">
          <div className="section-heading">
            <p className="section-eyebrow">What We Stand For</p>
            <h2>Values that keep retailers coming back</h2>
          </div>
          <div className="value-grid">
            {values.map((value) => (
              <article className="value-card" key={value.title}>
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-timeline">
          <div className="section-heading">
            <p className="section-eyebrow">The Journey</p>
            <h2>Milestones along the way</h2>
          </div>
          <ol className="timeline">
            {milestones.map((milestone) => (
              <li key={milestone.year} className="timeline-item">
                <div className="timeline-year">{milestone.year}</div>
                <div className="timeline-body">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-cta">
          <div className="about-cta-card">
            <h2>Want to partner with us?</h2>
            <p>
              Whether you're a retailer looking for steady supply or a
              business exploring distribution, we'd love to hear from you.
            </p>
            <a
              href={HOME_PATH}
              className="primary-button"
              onClick={(event) => {
                event.preventDefault();
                navigate(HOME_PATH);
              }}
            >
              Back to Home
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Akalwadi Associates. All rights reserved.</p>
      </footer>
    </div>
  );
}
