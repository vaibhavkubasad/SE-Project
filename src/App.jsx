import React, { useEffect, useState } from "react";
import UserType from "./UserType";
import About from "./About";
import OilList from "../oillist";
import OilListBeforeLogin from "../oillistbeforelogin";
import MasalaList from "../masalalist";
import MasalaListBeforeLogin from "../masalalistbeforlogin";
import Logout from "../logout";
import OrdersPage from "./OrdersPage";
import ManagerDashboard from "./ManagerDashboard";
import AdminDashboard from "./AdminDashboard";

const HOME_PATH = "/";
const ABOUT_PATH = "/about";
const USER_TYPE_PATH = "/usertype";
const OIL_LIST_PATH = "/oil";
const MASALA_LIST_PATH = "/spices";
const LOGOUT_PATH = "/logout";
const ORDERS_PATH = "/orders";
const MANAGER_PATH = "/manager";
const ADMIN_PATH = "/admin";

const navItems = [
  { label: "Home", href: HOME_PATH },
  { label: "About Us", href: ABOUT_PATH },
  {
    label: "Products",
    href: "#products",
    dropdown: [
      { label: "Spices", href: MASALA_LIST_PATH },
      { label: "Edible Oil", href: OIL_LIST_PATH }
    ]
  },
  { label: "Contact Us", href: "#contact" },
  { label: "Login", href: USER_TYPE_PATH }
];

const productCategories = [
  {
    name: "Edible Oil",
    path: OIL_LIST_PATH,
    icon: "🛢️",
    image: "/oils_category.jpg",
    description:
      "Premium cold-pressed and refined oils including Sunflower, Coconut, Groundnut, and Mustard — processed to strict food safety standards."
  },
  {
    name: "Spices",
    path: MASALA_LIST_PATH,
    icon: "🌶️",
    image: "/spices_category.jpg",
    description:
      "Aromatic whole and ground spices, authentic Indian masalas, and high-purity blends carrying the true flavor of heritage agricultural fields."
  }
];

const stats = [
  { value: "27+", label: "Years in business" },
  { value: "3", label: "Core categories" },
  { value: "100%", label: "Purity & Supply Focus" }
];

const whyChooseItems = [
  {
    icon: "🔬",
    title: "Quality Assurance",
    desc: "Strict grade testing and chemical-free processing ensure absolute product safety."
  },
  {
    icon: "🤝",
    title: "Unbroken Supply",
    desc: "A highly reliable supply chain with strict quality assurance and stock stability."
  },
  {
    icon: "🌱",
    title: "Sustainable Sourcing",
    desc: "Partnered directly with local farmers for ethically harvested, fair-trade crops."
  },
  {
    icon: "📦",
    title: "Premium Packaging",
    desc: "Eco-friendly, airtight vacuum protection guaranteeing long-lasting freshness."
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Highly optimized logistics network ensuring prompt, dependable dispatches."
  }
];

const certifications = [
  { logo: "📜", name: "ISO 9001:2015", lbl: "Quality Systems" },
  { logo: "🍏", name: "FSSAI Certified", lbl: "Food Safety India" },
  { logo: "🛡️", name: "FDA Approved", lbl: "Safety Standards" }
];



function getCurrentPath() {
  const path = window.location.pathname || HOME_PATH;
  if (path === "/index.html") return HOME_PATH;
  if (path === "/masalas") return MASALA_LIST_PATH;
  if (path === "/orders") return ORDERS_PATH;
  if (path === "/manager") return MANAGER_PATH;
  if (path === "/admin") return ADMIN_PATH;
  return path;
}

function navigateTo(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function SiteNav({ items = navItems, onNavigate, currentPath }) {
  const handleNavClick = (event, path) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) {
        event.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      event.preventDefault();
      (onNavigate || navigateTo)(path);
    }
  };

  return (
    <div className="header-container" style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: "rgba(250, 247, 242, 0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(85,107,47,0.12)", padding: "14px 40px"
    }}>
      <nav style={{
        display: "flex", alignItems: "center", justifySpace: "between", justifyContent: "space-between",
        maxWidth: "1340px", margin: "0 auto", width: "100%", gap: "2rem"
      }}>
        {/* Brand Logo matching Image 1 & 3 */}
        <a
          href={HOME_PATH}
          onClick={(event) => handleNavClick(event, HOME_PATH)}
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <div style={{
            background: "#556B2F", borderRadius: "50%", width: "42px", height: "42px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", fontWeight: "700", color: "#FAF7F2", fontFamily: "'Playfair Display', serif"
          }}>AA</div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#2B2B2B", letterSpacing: "0.03em", fontFamily: "'Playfair Display', serif", lineHeight: "1.1" }}>Akalwadi</div>
            <div style={{ fontSize: "9px", color: "#7A8279", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "600", marginTop: "1px" }}>Associates</div>
          </div>
        </a>

        {/* Links */}
        <ul className="nav-links" style={{
          display: "flex", alignItems: "center", gap: "6px", listStyle: "none", margin: 0, padding: 0
        }}>
          {items.map((item) => (
            <li
              key={item.label}
              className={item.dropdown ? "nav-dropdown" : ""}
              style={{ position: "relative" }}
            >
              <a
                href={item.href}
                className={currentPath === item.href ? "active" : ""}
                onClick={(event) => handleNavClick(event, item.href)}
                style={{
                  display: "inline-block", padding: "0.6rem 1.1rem", borderRadius: "6px",
                  fontWeight: "600", fontSize: "0.9rem", color: "#2B2B2B", fontFamily: "'Poppins', sans-serif"
                }}
              >
                {item.label}
                {item.dropdown && (
                  <span className="dropdown-arrow" style={{ marginLeft: "0.4rem", color: "#556B2F" }}>&#9662;</span>
                )}
              </a>
              {item.dropdown && (
                <ul className="dropdown-menu">
                  {item.dropdown.map((sub) => (
                    <li key={sub.label}>
                      <a
                        href={sub.href}
                        onClick={(event) => handleNavClick(event, sub.href)}
                      >
                        {sub.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            background: "#2B2B2B", color: "#FAF7F2", padding: "10px 22px", borderRadius: "24px",
            border: "none", fontSize: "13px", fontWeight: "600", cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.target.style.background = "#556B2F"}
          onMouseLeave={e => e.target.style.background = "#2B2B2B"}
        >
          Wholesale Inquiry ➔
        </button>
      </nav>
    </div>
  );
}

function HomePage() {
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    category: "Oils",
    message: ""
  });

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        category: "Oils",
        message: ""
      });
    }, 4000);
  };

  return (
    <div className="page-shell" style={{ background: "#FAF7F2" }}>
      {/* Dynamic typography styling */}
      <style>{`
        .custom-serif-header {
          font-family: 'Playfair Display', Georgia, serif;
          color: #2B2B2B;
        }
        .custom-sans-body {
          font-family: 'Poppins', sans-serif;
          color: #4B524A;
        }
        .custom-pill-badge {
          background: rgba(250, 247, 242, 0.9);
          border: 1px solid rgba(85,107,47,0.15);
          backdrop-filter: blur(10px);
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #556B2F;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(85,107,47,0.05);
          position: absolute;
          z-index: 10;
        }
        .category-card {
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(85,107,47,0.12);
          overflow: hidden;
          padding: 24px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(85,107,47,0.08);
          border-color: #D4A017;
        }
        .choose-grid-card {
          border-right: 1px solid rgba(85,107,47,0.12);
          border-bottom: 1px solid rgba(85,107,47,0.12);
          padding: 36px;
          transition: all 0.3s;
        }
        .choose-grid-card:hover {
          background: rgba(85,107,47,0.02);
        }
        .hero-grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 16px;
          width: 100%;
          height: 100%;
        }
        .hero-tile {
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          background: #ffffff;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(85,107,47,0.02);
          border: 1px solid rgba(85,107,47,0.08);
        }
        .hero-tile:hover {
          transform: translateY(-6px);
        }
        .hero-tile-oil {
          background: linear-gradient(135deg, rgba(212, 160, 23, 0.08) 0%, rgba(212, 160, 23, 0.02) 100%);
          border: 1px solid rgba(212, 160, 23, 0.15);
        }
        .hero-tile-oil:hover {
          border-color: rgba(212, 160, 23, 0.5);
          box-shadow: 0 20px 40px rgba(212, 160, 23, 0.12);
        }
        .hero-tile-spices {
          background: linear-gradient(135deg, rgba(142, 68, 173, 0.08) 0%, rgba(142, 68, 173, 0.02) 100%);
          border: 1px solid rgba(142, 68, 173, 0.15);
        }
        .hero-tile-spices:hover {
          border-color: rgba(142, 68, 173, 0.5);
          box-shadow: 0 20px 40px rgba(142, 68, 173, 0.12);
        }
        .hero-tile-supply {
          background: linear-gradient(135deg, rgba(39, 174, 96, 0.08) 0%, rgba(39, 174, 96, 0.02) 100%);
          border: 1px solid rgba(39, 174, 96, 0.15);
        }
        .hero-tile-supply:hover {
          border-color: rgba(39, 174, 96, 0.5);
          box-shadow: 0 20px 40px rgba(39, 174, 96, 0.12);
        }
        .hero-tile-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .hero-tile-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          font-weight: 700;
          color: #2B2B2B;
          margin: 0 0 4px 0;
        }
        .hero-tile-desc {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          color: #7A8279;
          margin: 0;
          line-height: 1.4;
        }
        .hero-tile-arrow {
          font-size: 13px;
          color: #556B2F;
          font-weight: bold;
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: transform 0.2s ease;
        }
        .hero-tile:hover .hero-tile-arrow {
          transform: translateX(4px);
        }
      `}</style>

      {/* Navbar Section */}
      <SiteNav currentPath={HOME_PATH} />

      {/* 1. HERO SECTION (Screenshot-accurate Split with Floating Badges - Image 3) */}
      <header className="hero-section" style={{
        padding: "80px 40px 60px", maxWidth: "1340px", margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "60px", alignItems: "center"
      }}>
        {/* Left Side Info */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <p className="eyebrow" style={{
            color: "#556B2F", letterSpacing: "0.15em", fontSize: "11px", fontWeight: "700", marginBottom: "16px"
          }}>
            🌿 ESTABLISHED 1998 · WHOLESALE & DISTRIBUTION
          </p>
          <h1 className="custom-serif-header" style={{
            fontSize: "62px", fontWeight: "700", lineHeight: "1.15", margin: "0 0 24px 0", letterSpacing: "-0.01em"
          }}>
            Premium Oils &<br/>
            Spices for <br/>
            <span style={{ color: "#556B2F", fontStyle: "italic" }}>Wholesale Markets.</span>
          </h1>
          <p className="custom-sans-body" style={{
            fontSize: "15px", lineHeight: "1.8", color: "#4B524A", marginBottom: "36px", maxWidth: "500px"
          }}>
            Akalwadi Associates supplies premium wholesale edible oils and 
            hand-selected whole spices. Driven by trust, purity, and 
            certified bulk B2B supply chains.
          </p>

          <div style={{ display: "flex", gap: "16px" }}>
            <a
              href="#products"
              style={{
                background: "#556B2F", color: "#FAF7F2", padding: "14px 30px", borderRadius: "30px",
                fontWeight: "700", fontSize: "14px", textDecoration: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 25px rgba(85,107,47,0.15)"
              }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Products ↗
            </a>
            <a
              href="#contact"
              style={{
                background: "#FAF7F2", color: "#556B2F", padding: "14px 30px", borderRadius: "30px",
                fontWeight: "700", fontSize: "14px", textDecoration: "none", cursor: "pointer",
                border: "1.5px solid rgba(85,107,47,0.3)", display: "inline-flex", alignItems: "center"
              }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Right Side Visual: Premium Interactive 2x2 Category Grid */}
        <div style={{ width: "100%", height: "480px" }}>
          <div className="hero-grid-container">
            {/* 1. Edible Oil */}
            <div 
              className="hero-tile hero-tile-oil"
              onClick={() => navigateTo(OIL_LIST_PATH)}
            >
              <div className="hero-tile-icon">🛢️</div>
              <div>
                <h3 className="hero-tile-title">Edible Oils</h3>
                <p className="hero-tile-desc">Cold-pressed & refined pure B2B wholesale oils.</p>
              </div>
              <div className="hero-tile-arrow">View Oils ➔</div>
            </div>

            {/* 2. Spices */}
            <div 
              className="hero-tile hero-tile-spices"
              onClick={() => navigateTo(MASALA_LIST_PATH)}
            >
              <div className="hero-tile-icon">🌶️</div>
              <div>
                <h3 className="hero-tile-title">Pure Spices</h3>
                <p className="hero-tile-desc">Aromatic ground masalas and single-estate spices.</p>
              </div>
              <div className="hero-tile-arrow">View Spices ➔</div>
            </div>



            {/* 4. Daily Supply */}
            <div 
              className="hero-tile hero-tile-supply"
              onClick={() => {
                const element = document.querySelector("#products");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div className="hero-tile-icon">🚚</div>
              <div>
                <h3 className="hero-tile-title">Daily Supply</h3>
                <p className="hero-tile-desc">Reliable regional distribution and robust logistics hubs.</p>
              </div>
              <div className="hero-tile-arrow">Our Operations ➔</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. CERTIFICATIONS TRUST banner */}
      <section style={{
        background: "#FAF7F2", borderTop: "1px solid rgba(85,107,47,0.12)", borderBottom: "1px solid rgba(85,107,47,0.12)",
        padding: "36px 40px", margin: "40px 0"
      }}>
        <div style={{ maxWidth: "1340px", margin: "0 auto", width: "100%", textAlign: "center" }}>
          <p className="eyebrow" style={{
            fontSize: "10px", letterSpacing: "0.2em", color: "#7A8279", fontWeight: "700", marginBottom: "24px"
          }}>
            CERTIFIED & TRUSTED BY LEADING COMPLIANCE BODIES
          </p>
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "60px",
            fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "#7A8279"
          }}>
            <span style={{ transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#556B2F"} onMouseLeave={e => e.target.style.color = "#7A8279"}>FSSAI</span>
            <span style={{ transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#556B2F"} onMouseLeave={e => e.target.style.color = "#7A8279"}>FDA</span>
            <span style={{ transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#556B2F"} onMouseLeave={e => e.target.style.color = "#7A8279"}>ISO</span>
          </div>
        </div>
      </section>

      {/* 3. ABOUT TEASER WITH EXPERIENCE COUNTERS (Image 3) */}
      <section className="about-teaser" style={{
        padding: "80px 40px", maxWidth: "1340px", margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center"
      }}>
        <div>
          <p className="eyebrow" style={{ color: "#556B2F", letterSpacing: "0.15em", fontSize: "11px", fontWeight: "700", marginBottom: "16px" }}>
            ABOUT AKALWADI
          </p>
          <h2 className="custom-serif-header" style={{ fontSize: "46px", fontWeight: "700", lineHeight: "1.2", margin: "0 0 24px 0" }}>
            A quiet obsession with <br/>
            <span style={{ color: "#556B2F", fontStyle: "italic" }}>purity</span>, scaled <br/>
            with integrity.
          </h2>
          <p className="custom-sans-body" style={{ fontSize: "15px", lineHeight: "1.8", color: "#4B524A", marginBottom: "20px" }}>
            Akalwadi Associates has spent over 27 years building premium, reliable FMCG distribution channels 
            for edible oils and spices. From high-purity agricultural processing units in Dharwad to advanced 
            logistic gateways, we ensure our business partners receive on-time shipments of premium wholesale quality.
          </p>
          <a
            href={ABOUT_PATH}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#556B2F",
              textDecoration: "none", fontSize: "14px"
            }}
            onClick={(e) => { e.preventDefault(); navigateTo(ABOUT_PATH); }}
          >
            Our Full Heritage &rarr;
          </a>
        </div>

        {/* Dynamic Counter Grid (Image 3) */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px 20px",
          borderLeft: "1px solid rgba(85,107,47,0.12)", paddingLeft: "40px"
        }}>
          <div>
            <h3 className="custom-serif-header" style={{ fontSize: "48px", fontWeight: "500", margin: "0 0 4px 0", color: "#2B2B2B" }}>25+</h3>
            <p className="custom-sans-body" style={{ fontSize: "10px", fontWeight: "700", color: "#7A8279", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Years of Experience</p>
          </div>
          <div>
            <h3 className="custom-serif-header" style={{ fontSize: "48px", fontWeight: "500", margin: "0 0 4px 0", color: "#2B2B2B" }}>120+</h3>
            <p className="custom-sans-body" style={{ fontSize: "10px", fontWeight: "700", color: "#7A8279", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Products Catalogued</p>
          </div>
          <div>
            <h3 className="custom-serif-header" style={{ fontSize: "48px", fontWeight: "500", margin: "0 0 4px 0", color: "#2B2B2B" }}>300+</h3>
            <p className="custom-sans-body" style={{ fontSize: "10px", fontWeight: "700", color: "#7A8279", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Commercial Partners</p>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES (Three pillars - Image 4) */}
      <section className="products-section" id="products" style={{
        padding: "80px 40px", maxWidth: "1340px", margin: "0 auto", width: "100%"
      }}>
        {/* Category Heading Split matching Image 4 */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "flex-end",
          borderBottom: "1px solid rgba(85,107,47,0.12)", paddingBottom: "32px", marginBottom: "48px"
        }}>
          <div>
            <p className="eyebrow" style={{ color: "#556B2F", letterSpacing: "0.15em", fontSize: "11px", fontWeight: "700", marginBottom: "12px" }}>
              PRODUCT CATEGORIES
            </p>
            <h2 className="custom-serif-header" style={{ fontSize: "46px", fontWeight: "700", lineHeight: "1.2", margin: 0 }}>
              Three pillars, <br/>
              one standard of <span style={{ color: "#556B2F", fontStyle: "italic" }}>excellence.</span>
            </h2>
          </div>
          <div>
            <p className="custom-sans-body" style={{ fontSize: "15px", lineHeight: "1.8", color: "#7A8279", margin: 0 }}>
              Every category is backed by traceable sourcing, food-grade packaging and quality-certified documentation.
            </p>
          </div>
        </div>

        {/* Category Cards matching Image 4 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px" }}>
          {/* Card 1: Edible Oils */}
          <article className="category-card" onClick={() => navigateTo(OIL_LIST_PATH)}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#7A8279", letterSpacing: "0.1em", textTransform: "uppercase" }}>COLD-PRESSED</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#556B2F", letterSpacing: "0.05em" }}>32 SKUS</span>
            </div>
            <div style={{ width: "100%", height: "280px", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
              <img 
                src="/oils_category.jpg" 
                alt="Edible Oils" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <h3 className="custom-serif-header" style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>Edible Oils</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.7", color: "#7A8279", marginBottom: "24px" }}>
              Single-origin groundnut, sesame, coconut and mustard oils, pressed in small batches for premium grocery and HoReCa channels.
            </p>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#556B2F", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              View Products ➔
            </span>
          </article>

          {/* Card 2: Spices */}
          <article className="category-card" onClick={() => navigateTo(MASALA_LIST_PATH)}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#7A8279", letterSpacing: "0.1em", textTransform: "uppercase" }}>SINGLE-ESTATE</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#556B2F", letterSpacing: "0.05em" }}>58 SKUS</span>
            </div>
            <div style={{ width: "100%", height: "280px", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
              <img 
                src="/spices_category.jpg" 
                alt="Whole & Ground Spices" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            </div>
            <h3 className="custom-serif-header" style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>Whole & Ground Spices</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.7", color: "#7A8279", marginBottom: "24px" }}>
              Hand-selected turmeric, chilli, cardamom and blends — milled to spec for industrial buyers and private-label brands.
            </p>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "#556B2F", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              View Products ➔
            </span>
          </article>
        </div>
      </section>

      {/* 5. WHY CHOOSE US GRID (Image 1) */}
      <section className="why-choose-section" style={{
        padding: "80px 40px", maxWidth: "1340px", margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: "60px", alignItems: "flex-start"
      }}>
        {/* Left Side Wording */}
        <div>
          <p className="eyebrow" style={{ color: "#556B2F", letterSpacing: "0.15em", fontSize: "11px", fontWeight: "700", marginBottom: "16px" }}>
            WHY CHOOSE US
          </p>
          <h2 className="custom-serif-header" style={{ fontSize: "46px", fontWeight: "700", lineHeight: "1.2", margin: "0 0 24px 0" }}>
            The standard <br/>
            our partners <br/>
            <span style={{ color: "#556B2F", fontStyle: "italic" }}>quietly trust.</span>
          </h2>
          <p className="custom-sans-body" style={{ fontSize: "15px", lineHeight: "1.8", color: "#7A8279" }}>
            Six principles that travel inside every container we ship.
          </p>
        </div>

        {/* Right Side 6-principle Grid matching Image 1 */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          borderTop: "1px solid rgba(85,107,47,0.12)", borderLeft: "1px solid rgba(85,107,47,0.12)"
        }}>
          {/* Grid 1: Quality Assurance */}
          <div className="choose-grid-card">
            <span style={{ fontSize: "18px", color: "#556B2F", display: "inline-block", marginBottom: "16px" }}>🛡️</span>
            <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Quality Assurance</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.6", color: "#7A8279", margin: 0 }}>
              Lab tested every batch — moisture, purity, microbial and pesticide-residue panels.
            </p>
          </div>

          {/* Grid 2: Sustainable Sourcing */}
          <div className="choose-grid-card">
            <span style={{ fontSize: "18px", color: "#556B2F", display: "inline-block", marginBottom: "16px" }}>🍃</span>
            <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Sustainable Sourcing</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.6", color: "#7A8279", margin: 0 }}>
              Direct partnerships with farmer collectives across India's heritage growing regions.
            </p>
          </div>

          {/* Grid 3: Unbroken Supply */}
          <div className="choose-grid-card">
            <span style={{ fontSize: "18px", color: "#556B2F", display: "inline-block", marginBottom: "16px" }}>🤝</span>
            <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Unbroken Supply</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.6", color: "#7A8279", margin: 0 }}>
              Dependable daily logistics and stock buffers designed to eliminate market downtime.
            </p>
          </div>

          {/* Grid 4: Premium Packaging */}
          <div className="choose-grid-card">
            <span style={{ fontSize: "18px", color: "#556B2F", display: "inline-block", marginBottom: "16px" }}>📦</span>
            <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Premium Packaging</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.6", color: "#7A8279", margin: 0 }}>
              Food-grade, retail-ready packaging engineered for long-haul transit.
            </p>
          </div>

          {/* Grid 5: Daily Dispatch */}
          <div className="choose-grid-card">
            <span style={{ fontSize: "18px", color: "#556B2F", display: "inline-block", marginBottom: "16px" }}>🚛</span>
            <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Daily Dispatch</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.6", color: "#7A8279", margin: 0 }}>
              Cold-chain and FCL/LCL logistics with same-day port handover.
            </p>
          </div>

          {/* Grid 6: Trusted Manufacturing */}
          <div className="choose-grid-card">
            <span style={{ fontSize: "18px", color: "#556B2F", display: "inline-block", marginBottom: "16px" }}>🏭</span>
            <h3 className="custom-serif-header" style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Trusted Manufacturing</h3>
            <p className="custom-sans-body" style={{ fontSize: "13px", lineHeight: "1.6", color: "#7A8279", margin: 0 }}>
              ISO 22000 facilities with traceable lot codes and full QC archives.
            </p>
          </div>
        </div>
      </section>


      {/* 8. CONTACT SECTION */}
      <section className="contact-section" id="contact" style={{
        padding: "80px 40px", maxWidth: "1340px", margin: "0 auto", width: "100%"
      }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p className="eyebrow" style={{ color: "#556B2F", letterSpacing: "0.15em", fontSize: "11px", fontWeight: "700", marginBottom: "16px" }}>
            GET IN TOUCH
          </p>
          <h2 className="custom-serif-header" style={{ fontSize: "42px", fontWeight: "700", lineHeight: "1.2", margin: "0 0 16px 0" }}>
            Contact Us
          </h2>
          <p className="custom-sans-body" style={{ fontSize: "15px", lineHeight: "1.8", color: "#7A8279", maxWidth: "600px", margin: "0 auto" }}>
            Have questions about wholesale orders, delivery or pricing? Our team is ready to help.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", maxWidth: "960px", margin: "0 auto" }}>
          <div style={{
            background: "#fff", padding: "36px", borderRadius: "24px",
            border: "1px solid rgba(85,107,47,0.12)", textAlign: "center"
          }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "16px" }}>📍</span>
            <h4 className="custom-serif-header" style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 8px 0" }}>Office</h4>
            <p className="custom-sans-body" style={{ fontSize: "13px", color: "#7A8279", margin: 0, lineHeight: "1.6" }}>Akalwadi Associates, Old APMC Market, Dharwad, Karnataka, India</p>
          </div>
          <div style={{
            background: "#fff", padding: "36px", borderRadius: "24px",
            border: "1px solid rgba(85,107,47,0.12)", textAlign: "center"
          }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "16px" }}>📞</span>
            <h4 className="custom-serif-header" style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 8px 0" }}>Wholesale Hotline</h4>
            <p className="custom-sans-body" style={{ fontSize: "13px", color: "#7A8279", margin: 0, lineHeight: "1.6" }}>+91 94481 33699<br/>+91 84313 09384</p>
          </div>
          <div style={{
            background: "#fff", padding: "36px", borderRadius: "24px",
            border: "1px solid rgba(85,107,47,0.12)", textAlign: "center"
          }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "16px" }}>✉️</span>
            <h4 className="custom-serif-header" style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 8px 0" }}>Email</h4>
            <p className="custom-sans-body" style={{ fontSize: "13px", color: "#7A8279", margin: 0, lineHeight: "1.6" }}>trade@akalwadiassociates.com<br/>info@akalwadi.com</p>
          </div>
        </div>
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="site-footer" style={{
        background: "#2B2B2B", color: "#FAF7F2", padding: "60px 40px 30px", borderTop: "1px solid rgba(85,107,47,0.1)"
      }}>
        <div className="footer-content" style={{
          maxWidth: "1340px", margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 1.2fr", gap: "40px", marginBottom: "40px"
        }}>
          <div className="footer-brand">
            <h3 className="custom-serif-header" style={{ color: "#FAF7F2", fontSize: "20px", margin: "0 0 16px 0" }}>AKALWADI ASSOCIATES</h3>
            <p className="custom-sans-body" style={{ color: "#7A8279", fontSize: "13px", lineHeight: "1.7", margin: 0 }}>
              Leading premium FMCG wholesale distributors and suppliers of edible oils and spices.
            </p>
          </div>

          <div className="footer-links">
            <h4 className="custom-serif-header" style={{ color: "#FAF7F2", fontSize: "15px", margin: "0 0 16px 0" }}>Product Sectors</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px" }}>
              <li><a href={OIL_LIST_PATH} onClick={(e) => { e.preventDefault(); navigateTo(OIL_LIST_PATH); }} style={{ color: "#7A8279", fontSize: "13px", textDecoration: "none" }}>Edible Oils</a></li>
              <li><a href={MASALA_LIST_PATH} onClick={(e) => { e.preventDefault(); navigateTo(MASALA_LIST_PATH); }} style={{ color: "#7A8279", fontSize: "13px", textDecoration: "none" }}>Pure Spices</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="custom-serif-header" style={{ color: "#FAF7F2", fontSize: "15px", margin: "0 0 16px 0" }}>Trade Desk</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px" }}>
              <li><a href={ABOUT_PATH} onClick={(e) => { e.preventDefault(); navigateTo(ABOUT_PATH); }} style={{ color: "#7A8279", fontSize: "13px", textDecoration: "none" }}>Our Rich Heritage</a></li>
              <li><a href={USER_TYPE_PATH} onClick={(e) => { e.preventDefault(); navigateTo(USER_TYPE_PATH); }} style={{ color: "#7A8279", fontSize: "13px", textDecoration: "none" }}>Distributor Login</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }} style={{ color: "#7A8279", fontSize: "13px", textDecoration: "none" }}>B2B Bulk Inquiries</a></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h4 className="custom-serif-header" style={{ color: "#FAF7F2", fontSize: "15px", margin: "0 0 16px 0" }}>Newsletter</h4>
            <p className="custom-sans-body" style={{ color: "#7A8279", fontSize: "13px", lineHeight: "1.6", marginBottom: "16px", margin: 0 }}>Subscribe to receive quarterly crop forecasts, market forecasts, and harvest arrivals.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} style={{ display: "flex", gap: "8px" }}>
              <input 
                type="email" 
                placeholder="trade@company.com" 
                required 
                aria-label="Corporate Email" 
                style={{
                  background: "#FAF7F2", border: "none", padding: "10px 14px", borderRadius: "6px",
                  fontSize: "12px", width: "100%", outline: "none"
                }}
              />
              <button 
                type="submit"
                style={{
                  background: "#556B2F", color: "#FAF7F2", border: "none", borderRadius: "6px",
                  padding: "10px 16px", fontWeight: "700", fontSize: "12px", cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "#465826"}
                onMouseLeave={e => e.target.style.background = "#556B2F"}
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom" style={{
          maxWidth: "1340px", margin: "0 auto", width: "100%", borderTop: "1px solid rgba(122, 130, 121, 0.15)",
          paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
          color: "#7A8279", fontSize: "12px"
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Akalwadi Associates. Sourced ethically. Distributed nationwide.</p>
          <p style={{ margin: 0 }}>Dharwad, Karnataka, India</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [pathname, setPathname] = useState(getCurrentPath);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  });
  const [selectedType, setSelectedType] = useState(() => {
    try {
      const persisted = JSON.parse(localStorage.getItem("currentUser") || "null");
      return persisted?.role || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const handleRouteChange = () => {
      setPathname(getCurrentPath());
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  if (pathname === USER_TYPE_PATH) {
    return currentUser ? (
      <Logout
        selectedType={currentUser.role}
        onNavigate={navigateTo}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          setSelectedType("");
          navigateTo(HOME_PATH);
        }}
      />
    ) : (
      <UserType
        selectedType={selectedType}
        onSelect={setSelectedType}
        onBack={() => navigateTo(HOME_PATH)}
        onLoginSuccess={(user) => {
          const userWithRole = { ...user, role: selectedType };
          setCurrentUser(userWithRole);
          localStorage.setItem("currentUser", JSON.stringify(userWithRole));
          navigateTo(LOGOUT_PATH);
        }}
      />
    );
  }

  if (pathname === ABOUT_PATH) {
    return <About onNavigate={navigateTo} />;
  }

  if (pathname === LOGOUT_PATH) {
    return currentUser ? (
      <Logout
        selectedType={currentUser.role}
        onNavigate={navigateTo}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          setSelectedType("");
          navigateTo(HOME_PATH);
        }}
      />
    ) : (
      <HomePage />
    );
  }

  if (pathname === OIL_LIST_PATH) {
    return currentUser?.role ? <OilList /> : <OilListBeforeLogin />;
  }

  if (pathname === MASALA_LIST_PATH) {
    return currentUser?.role ? <MasalaList /> : <MasalaListBeforeLogin />;
  }

  if (pathname === ORDERS_PATH) {
    return currentUser?.role === "Wholesaler" ? (
      <OrdersPage onNavigate={navigateTo} />
    ) : currentUser ? (
      <Logout
        selectedType={currentUser.role}
        onNavigate={navigateTo}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          setSelectedType("");
          navigateTo(HOME_PATH);
        }}
      />
    ) : (
      <HomePage />
    );
  }

  if (pathname === MANAGER_PATH) {
    return currentUser?.role === "Manager" ? (
      <ManagerDashboard onNavigate={navigateTo} />
    ) : currentUser ? (
      <Logout
        selectedType={currentUser.role}
        onNavigate={navigateTo}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          setSelectedType("");
          navigateTo(HOME_PATH);
        }}
      />
    ) : (
      <HomePage />
    );
  }

  if (pathname === ADMIN_PATH) {
    return currentUser?.role === "Admin" ? (
      <AdminDashboard onNavigate={navigateTo} />
    ) : currentUser ? (
      <Logout
        selectedType={currentUser.role}
        onNavigate={navigateTo}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          setSelectedType("");
          navigateTo(HOME_PATH);
        }}
      />
    ) : (
      <HomePage />
    );
  }

  return currentUser ? (
    <Logout
      selectedType={currentUser.role}
      onNavigate={navigateTo}
      onLogout={() => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
        setSelectedType("");
        navigateTo(HOME_PATH);
      }}
    />
  ) : (
    <HomePage />
  );
}

export default App;
