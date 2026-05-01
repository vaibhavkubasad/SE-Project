import React, { useEffect, useState } from "react";
import UserType from "./UserType";
import About from "./About";
import OilList from "../oillist";
import OilListBeforeLogin from "../oillistbeforelogin";
import MasalaList from "../masalalist";
import MasalaListBeforeLogin from "../masalalistbeforlogin";
import Logout from "../logout";

const HOME_PATH = "/";
const ABOUT_PATH = "/about";
const USER_TYPE_PATH = "/usertype";
const OIL_LIST_PATH = "/oil";
const MASALA_LIST_PATH = "/spices";
const LOGOUT_PATH = "/logout";

const navItems = [
  { label: "Home", href: HOME_PATH },
  { label: "About Us", href: ABOUT_PATH },
  {
    label: "Products",
    href: "#products",
    dropdown: [
      { label: "Toiletries", href: "#products" },
      { label: "Spices", href: MASALA_LIST_PATH },
      { label: "Edible Oil", href: OIL_LIST_PATH }
    ]
  },
  { label: "Contact Us", href: "#contact" },
  { label: "Login", href: USER_TYPE_PATH }
];

const contactReasons = [
  "Wholesale product inquiries",
  "Order placement and delivery updates",
  "Retailer and distributor partnerships",
  "General product information"
];

const productCategories = [
  {
    name: "Edible Oil",
    path: OIL_LIST_PATH,
    icon: "🛢️",
    description:
      "Sunflower, coconut, mustard, groundnut and more — sourced from trusted brands and delivered fresh."
  },
  {
    name: "Spices",
    path: MASALA_LIST_PATH,
    icon: "🌶️",
    description:
      "Authentic Indian masalas, whole and ground spices that carry the flavour of every kitchen."
  },
  {
    name: "Toiletries",
    path: null,
    icon: "🧴",
    description:
      "Daily personal care essentials kept in steady supply for busy retail counters and households."
  }
];

const stats = [
  { value: "27+", label: "Years in business" },
  { value: "500+", label: "Retail partners" },
  { value: "3", label: "Core categories" },
  { value: "100%", label: "On-time supply focus" }
];

function getCurrentPath() {
  const path = window.location.pathname || HOME_PATH;
  if (path === "/index.html") return HOME_PATH;
  if (path === "/masalas") return MASALA_LIST_PATH;
  return path;
}

function navigateTo(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function SiteNav({ items = navItems, onNavigate, currentPath }) {
  return (
    <nav className="navbar">
      <a
        href={HOME_PATH}
        className="brand"
        onClick={(event) => {
          event.preventDefault();
          (onNavigate || navigateTo)(HOME_PATH);
        }}
      >
        <span className="brand-mark">AA</span>
        <span className="brand-name">AKALWADI ASSOCIATES</span>
      </a>

      <ul className="nav-links">
        {items.map((item) => (
          <li
            key={item.label}
            className={item.dropdown ? "nav-dropdown" : ""}
          >
            <a
              href={item.href}
              className={currentPath === item.href ? "active" : ""}
              onClick={(event) => {
                if (
                  item.href === USER_TYPE_PATH ||
                  item.href === ABOUT_PATH ||
                  item.href === HOME_PATH
                ) {
                  event.preventDefault();
                  (onNavigate || navigateTo)(item.href);
                }
              }}
            >
              {item.label}
              {item.dropdown && (
                <span className="dropdown-arrow">&#9662;</span>
              )}
            </a>
            {item.dropdown && (
              <ul className="dropdown-menu">
                {item.dropdown.map((sub) => (
                  <li key={sub.label}>
                    <a
                      href={sub.href}
                      onClick={(event) => {
                        if (
                          sub.href === OIL_LIST_PATH ||
                          sub.href === MASALA_LIST_PATH
                        ) {
                          event.preventDefault();
                          (onNavigate || navigateTo)(sub.href);
                        }
                      }}
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
    </nav>
  );
}

function HomePage() {
  return (
    <div className="page-shell">
      <header className="hero-section" id="top">
        <SiteNav currentPath={HOME_PATH} />

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">Wholesalers and Distributors Since 1998</p>
            <h1>
              Reliable FMCG supply for retailers and business partners.
            </h1>
            <p className="hero-lead">
              Akalwadi Associates keeps shelves stocked across Dharwad with
              quality edible oils, spices and toiletries — backed by decades
              of trust and timely delivery.
            </p>

            <div className="hero-actions">
              <a
                href={USER_TYPE_PATH}
                className="primary-button"
                onClick={(event) => {
                  event.preventDefault();
                  navigateTo(USER_TYPE_PATH);
                }}
              >
                Wholesaler Login
              </a>
              <a href="#contact" className="secondary-button">
                Contact Us
              </a>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card">
              <div className="hero-card-row">
                <div className="hero-tile hero-tile-oil">
                  <span className="hero-tile-icon">🛢️</span>
                  <span>Edible Oil</span>
                </div>
                <div className="hero-tile hero-tile-spice">
                  <span className="hero-tile-icon">🌶️</span>
                  <span>Spices</span>
                </div>
              </div>
              <div className="hero-card-row">
                <div className="hero-tile hero-tile-toiletries">
                  <span className="hero-tile-icon">🧴</span>
                  <span>Toiletries</span>
                </div>
                <div className="hero-tile hero-tile-supply">
                  <span className="hero-tile-icon">🚚</span>
                  <span>Daily Supply</span>
                </div>
              </div>
            </div>
            <div className="hero-glow" />
          </div>
        </div>

        <div className="stat-strip">
          {stats.map((stat) => (
            <div className="stat-item" key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="content">
        <section className="products-section" id="products">
          <div className="section-heading">
            <p className="section-eyebrow">What We Distribute</p>
            <h2>Everyday essentials, dependable supply</h2>
            <p className="section-sub">
              Three categories at the heart of our business, supplied to
              retail stores across the region.
            </p>
          </div>

          <div className="product-grid">
            {productCategories.map((product) => (
              <article
                className={`product-card${product.path ? " product-card-clickable" : ""}`}
                key={product.name}
                onClick={() => product.path && navigateTo(product.path)}
                style={product.path ? { cursor: "pointer" } : {}}
              >
                <div className="product-icon">{product.icon}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.path && (
                  <span className="product-card-link">View Products &rarr;</span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="about-teaser">
          <div className="about-teaser-text">
            <p className="section-eyebrow">About Akalwadi Associates</p>
            <h2>Built on trust since 1998</h2>
            <p>
              Akalwadi Associates has spent more than two decades serving
              retailers and businesses across Dharwad with consistent
              wholesale supply and personalised service.
            </p>
            <a
              href={ABOUT_PATH}
              className="primary-button"
              onClick={(event) => {
                event.preventDefault();
                navigateTo(ABOUT_PATH);
              }}
            >
              Learn More About Us
            </a>
          </div>
          <div className="about-teaser-graphic" aria-hidden="true">
            <div className="badge-pill">Wholesale</div>
            <div className="badge-pill">Distribution</div>
            <div className="badge-pill">Dharwad</div>
            <div className="badge-pill">Since 1998</div>
          </div>
        </section>

        <section className="details-grid" id="contact">
          <article className="detail-card">
            <h2>Contact Details</h2>
            <p>
              At Akalwadi Associates, we value strong relationships with our
              retailers and business partners. If you have any inquiries
              regarding our products, wholesale orders, or delivery services,
              our team is always ready to assist you.
            </p>
          </article>

          <article className="detail-card">
            <h2>Business Details</h2>
            <p>
              Akalwadi Associates — wholesalers and distributors of oil,
              spices and toiletries.
            </p>
            <p>
              <strong>Address:</strong> Dharwad, Karnataka, India
            </p>
            <p>
              <strong>Phone:</strong> +91 XXXXX XXXXX
            </p>
            <p>
              <strong>Email:</strong> info@akalwadiassociates.com
            </p>
            <p>
              <strong>Working Hours:</strong> Monday – Saturday | 9:00 AM – 7:00 PM
            </p>
          </article>

          <article className="detail-card detail-card-wide">
            <h2>Get In Touch</h2>
            <p>You can contact us for:</p>
            <ul className="reason-list">
              {contactReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Akalwadi Associates. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  const [pathname, setPathname] = useState(getCurrentPath);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const handleRouteChange = () => {
      setPathname(getCurrentPath());
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  if (pathname === USER_TYPE_PATH) {
    return (
      <UserType
        selectedType={selectedType}
        onSelect={setSelectedType}
        onBack={() => navigateTo(HOME_PATH)}
        onLoginSuccess={() => navigateTo(LOGOUT_PATH)}
      />
    );
  }

  if (pathname === ABOUT_PATH) {
    return <About onNavigate={navigateTo} />;
  }

  if (pathname === LOGOUT_PATH) {
    return (
      <Logout
        selectedType={selectedType}
        onNavigate={navigateTo}
        onLogout={() => {
          setSelectedType("");
          navigateTo(HOME_PATH);
        }}
      />
    );
  }

  if (pathname === OIL_LIST_PATH) {
    return selectedType ? <OilList /> : <OilListBeforeLogin />;
  }

  if (pathname === MASALA_LIST_PATH) {
    return selectedType ? <MasalaList /> : <MasalaListBeforeLogin />;
  }

  return <HomePage />;
}

export default App;
