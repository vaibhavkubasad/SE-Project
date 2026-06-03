import React from "react";
import { SiteNav } from "./App";

const HOME_PATH = "/";
const ABOUT_PATH = "/about";

export default function About({ onNavigate }) {
  const navigate = onNavigate || (() => {});

  return (
    <div className="page-shell about-page" style={{ background: "#FAF7F2", minHeight: "100vh" }}>
      {/* Premium Embedded Stylesheet for Custom Hover Interactions & Animations */}
      <style>{`
        .about-page {
          font-family: 'Poppins', sans-serif;
        }
        .custom-serif-header {
          font-family: 'Playfair Display', Georgia, serif;
          color: #2B2B2B;
        }
        .custom-sans-body {
          font-family: 'Poppins', sans-serif;
          color: #4B524A;
        }
        
        /* Modern Micro-animations & Interactive States */
        .premium-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(85, 107, 47, 0.1);
          box-shadow: 0 10px 30px rgba(85, 107, 47, 0.01);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .premium-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(85, 107, 47, 0.08);
          border-color: rgba(85, 107, 47, 0.3);
        }

        .famous-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 768px) {
          .famous-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .famous-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid rgba(85, 107, 47, 0.08);
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: justify;
          text-justify: inter-word;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(85, 107, 47, 0.02);
        }
        .famous-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 45px rgba(85, 107, 47, 0.09);
          border-color: #556B2F;
        }

        .portfolio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 36px;
        }
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .portfolio-card {
          background: #ffffff;
          padding: 36px;
          border-radius: 24px;
          border: 1px solid rgba(85, 107, 47, 0.12);
          box-shadow: 0 4px 20px rgba(85, 107, 47, 0.01);
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: justify;
          text-justify: inter-word;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portfolio-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 40px rgba(85, 107, 47, 0.08);
          border-color: #D4A017;
        }

        .facility-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: #E8EDE4;
        }
        .facility-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .facility-card:hover img {
          transform: scale(1.05);
        }
        .facility-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(85, 107, 47, 0.15);
        }
        .facility-label {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(250, 247, 242, 0.95);
          backdrop-filter: blur(10px);
          color: #2B2B2B;
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        .foundation-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .foundation-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .facilities-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        @media (max-width: 768px) {
          .facilities-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .facility-card {
            height: 280px !important;
          }
        }
      `}</style>

      {/* 1. HEADER HERO SECTION */}
      <header className="about-hero" style={{
        background: "linear-gradient(180deg, #E8EDE4 0%, #FAF7F2 100%)",
        paddingBottom: "40px"
      }}>
        <SiteNav onNavigate={navigate} currentPath={ABOUT_PATH} />

        <div className="about-hero-content" style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "80px 40px 40px 40px",
          textAlign: "center"
        }}>
          <p className="eyebrow" style={{
            color: "#556B2F",
            letterSpacing: "0.15em",
            fontSize: "12px",
            fontWeight: "700",
            textTransform: "uppercase",
            marginBottom: "16px",
            display: "inline-block"
          }}>
            About Us · Akalwadi Associates
          </p>
          <h1 id="about-hero-title" className="custom-serif-header" style={{
            fontSize: "48px",
            fontWeight: "800",
            lineHeight: "1.2",
            color: "#2B2B2B",
            marginBottom: "0px",
            fontFamily: "'Playfair Display', serif"
          }}>
            Our Heritage: An Unbroken Legacy in Dharwad
          </h1>
        </div>
      </header>

      <main className="about-main">
        {/* 2. OUR FOUNDATION: ESTABLISHING COMMERCIAL DOMINANCE */}
        <section id="about-foundation" style={{
          padding: "40px 40px 80px 40px",
          maxWidth: "1140px",
          margin: "0 auto"
        }}>
          <div className="premium-card">
            <div className="foundation-grid">
              <div>
                <p className="eyebrow" style={{
                  color: "#556B2F",
                  letterSpacing: "0.15em",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  marginBottom: "12px"
                }}>
                  Our Foundation
                </p>
                <h2 className="custom-serif-header" style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#2B2B2B",
                  marginBottom: "20px",
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: "1.3"
                }}>
                  Establishing Commercial Dominance in Dharwad
                </h2>
                <p className="custom-sans-body" style={{
                  fontSize: "15px",
                  lineHeight: "1.8",
                  color: "#4B524A",
                  margin: 0,
                  textAlign: "justify",
                  textJustify: "inter-word"
                }}>
                  Formally registered as a wholesale partnership entity in 2010, <strong>Akalwadi Associates</strong> has rapidly grown into one of North Karnataka's premier Fast-Moving Consumer Goods (FMCG) distribution houses. Operating under the experienced guidance of partner <strong>Mr. Subhas Akalwadi</strong>, and having seamlessly transitioned into the modern commercial framework under the GST regime, our firm manages a robust, multi-crore operational portfolio. We serve as the critical commercial bridge connecting national and regional manufacturers with the fragmented local retail networks across the Hubballi-Dharwad twin-city corridor.
                </p>
              </div>

              <div style={{
                background: "#FAF7F2",
                padding: "32px",
                borderRadius: "18px",
                border: "1px solid rgba(85, 107, 47, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "16px"
              }}>
                <h4 className="custom-serif-header" style={{ fontSize: "16px", fontWeight: "700", color: "#2B2B2B", margin: 0 }}>
                  Key Milestones
                </h4>
                <div style={{ borderBottom: "1px solid rgba(85, 107, 47, 0.08)", paddingBottom: "10px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#7A8279", display: "block", fontWeight: "600" }}>Partnership Formed</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#556B2F" }}>2010 Wholesale Registry</span>
                </div>
                <div style={{ borderBottom: "1px solid rgba(85, 107, 47, 0.08)", paddingBottom: "10px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#7A8279", display: "block", fontWeight: "600" }}>Managing Partner</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#2B2B2B" }}>Mr. Subhas Akalwadi</span>
                </div>
                <div style={{ borderBottom: "1px solid rgba(85, 107, 47, 0.08)", paddingBottom: "10px" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#7A8279", display: "block", fontWeight: "600" }}>Commercial Model</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#2B2B2B" }}>GST Compliant Logistics</span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#7A8279", display: "block", fontWeight: "600" }}>Operation Corridor</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "#2B2B2B" }}>Hubballi-Dharwad Twin-City</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHY WE ARE FAMOUS */}
        <section id="about-reliability" style={{
          background: "#E8EDE4",
          padding: "80px 40px",
          borderTop: "1px solid rgba(85, 107, 47, 0.08)",
          borderBottom: "1px solid rgba(85, 107, 47, 0.08)"
        }}>
          <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="eyebrow" style={{
                color: "#556B2F",
                letterSpacing: "0.15em",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                marginBottom: "12px"
              }}>
                The Architecture of Reliability
              </p>
              <h2 className="custom-serif-header" style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#2B2B2B",
                margin: 0,
                fontFamily: "'Playfair Display', serif"
              }}>
                Why We Are Famous
              </h2>
            </div>

            <div className="famous-grid">
              {/* Card 1 */}
              <div className="famous-card">
                <div style={{ fontSize: "28px" }}>🛡️</div>
                <h3 className="custom-serif-header" style={{ fontSize: "20px", fontWeight: "700", color: "#2B2B2B", margin: 0 }}>
                  Unbreakable Supply Chain Reliability
                </h3>
                <p className="custom-sans-body" style={{ fontSize: "14px", lineHeight: "1.7", color: "#4B524A", margin: 0 }}>
                  In the highly competitive tier-two markets, we are famous for one critical, non-negotiable attribute: unbreakable supply chain reliability. Retailers and institutional buyers trust us to never default on critical inventory lines. We are famous for absorbing the immense financial and logistical friction that typically exists in traditional Indian retail, allowing our partners to focus purely on serving their customers.
                </p>
              </div>

              {/* Card 2 */}
              <div className="famous-card">
                <div style={{ fontSize: "28px" }}>📍</div>
                <h3 className="custom-serif-header" style={{ fontSize: "20px", fontWeight: "700", color: "#2B2B2B", margin: 0 }}>
                  Sophisticated Dual-Location Strategy
                </h3>
                <p className="custom-sans-body" style={{ fontSize: "14px", lineHeight: "1.7", color: "#4B524A", margin: 0 }}>
                  Our operational dominance is powered by a sophisticated dual-location strategy. We maintain our administrative and partner-relations headquarters in the commercial heart of Dharwad at Sheelvantar Street, Kamankatti. Simultaneously, our physical bulk logistics and heavy warehousing operations are executed from our expansive facilities on the Old APMC Road. This spatial agility allows our localized delivery fleets to achieve unmatched market penetration, servicing diverse demand centers from the Belur Industrial Area to the residential layouts of Vidyagiri, Saptapura, and Malmaddi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NEW: DISTRIBUTION & WAREHOUSING FACILITIES */}
        <section id="about-facilities" style={{
          padding: "40px 40px 80px 40px",
          maxWidth: "1140px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p className="eyebrow" style={{
              color: "#556B2F",
              letterSpacing: "0.15em",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              Operational Infrastructure
            </p>
            <h2 className="custom-serif-header" style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#2B2B2B",
              marginBottom: "16px",
              fontFamily: "'Playfair Display', serif"
            }}>
              Our Distribution & Storage Facilities
            </h2>
            <p className="custom-sans-body" style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#7A8279",
              maxWidth: "800px",
              margin: "0 auto"
  }}>
              Take an inside look at our active heavy logistics warehousing and inventory stockpiles on Old APMC Road, accommodating high-volume dual-location supply requirements.
            </p>
          </div>

          <div className="facilities-grid" style={{ height: "400px" }}>
            <div className="facility-card" style={{ height: "100%" }}>
              <img src="/about_sacks.jpg" alt="Bulk Sacks Storage" />
              <div className="facility-label">Bulk Sacks Storage</div>
            </div>
            <div className="facility-card" style={{ height: "100%" }}>
              <img src="/about_boxes.jpg" alt="Boxed Inventory & Spices" />
              <div className="facility-label">Boxed Inventory & Spices</div>
            </div>
          </div>
        </section>

        {/* 4. PREMIER BRAND PORTFOLIO */}
        <section id="about-portfolio" style={{
          padding: "80px 40px",
          maxWidth: "1140px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p className="eyebrow" style={{
              color: "#556B2F",
              letterSpacing: "0.15em",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              Custodians of Quality
            </p>
            <h2 className="custom-serif-header" style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#2B2B2B",
              marginBottom: "16px",
              fontFamily: "'Playfair Display', serif"
            }}>
              Our Premier Brand Portfolio
            </h2>
            <p className="custom-sans-body" style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#7A8279",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              We serve as the chosen regional custodians for India’s most trusted household brands, curating a strategic portfolio that guarantees volume movement and unparalleled retail shelf presence:
            </p>
          </div>

          <div className="portfolio-grid">
            {/* Brand 1: Culinary Excellence */}
            <article className="portfolio-card">
              <div style={{ fontSize: "32px" }}>🌶️</div>
              <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", color: "#2B2B2B", margin: 0 }}>
                Culinary Excellence <br/>
                <span style={{ fontSize: "14px", color: "#556B2F" }}>(Swastik & Rala)</span>
              </h3>
              <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.7", color: "#4B524A", margin: 0 }}>
                We proudly distribute Swastik's majestic 50-year legacy of authentic South Indian flavors, supplying the region with their highly demanded spices, instant mixes, and traditional pickles. Additionally, we distribute the premium Rala brand, providing top-tier pure grounded spices, authentic turmeric, and high-value nutritional commodities like Foxtail Millet to discerning, health-conscious consumers.
              </p>
            </article>

            {/* Brand 2: Edible Oils */}
            <article className="portfolio-card">
              <div style={{ fontSize: "32px" }}>🌻</div>
              <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", color: "#2B2B2B", margin: 0 }}>
                High-Volume Edible Oils <br/>
                <span style={{ fontSize: "14px", color: "#556B2F" }}>(Freedom & Gemini)</span>
              </h3>
              <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.7", color: "#4B524A", margin: 0 }}>
                As an essential node in the regional supply chain, we handle the massive logistical requirements of distributing high-tonnage edible oils from both Freedom and Gemini. By maintaining continuous bulk supply lines, we guarantee that the most essential cooking staples flow seamlessly from coastal refineries to local kitchens.
              </p>
            </article>
          </div>
        </section>

        {/* 5. MISSION STATEMENT */}
        <section id="about-mission" style={{
          background: "#556B2F",
          color: "#FAF7F2",
          padding: "80px 40px",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <p className="eyebrow" style={{
              color: "#FAF7F2",
              opacity: 0.85,
              letterSpacing: "0.2em",
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}>
              Our Mission
            </p>
            <h2 className="custom-serif-header" style={{
              fontSize: "32px",
              fontWeight: "700",
              lineHeight: "1.5",
              color: "#FAF7F2",
              fontFamily: "'Playfair Display', serif",
              margin: 0
            }}>
              "At Akalwadi Associates, we do not merely move inventory; we sustain the local economy. We carry the history of Dharwad in our name, and we carry its future in our supply chain."
            </h2>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="site-footer" style={{
        background: "#2B2B2B",
        color: "#FAF7F2",
        padding: "40px",
        textAlign: "center",
        borderTop: "1px solid rgba(85,107,47,0.1)"
      }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#7A8279" }}>
          © {new Date().getFullYear()} Akalwadi Associates. All rights reserved. Dharwad, Karnataka, India.
        </p>
      </footer>
    </div>
  );
}
