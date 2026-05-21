import React from "react";

const HOME_PATH = "/";
const ABOUT_PATH = "/about";
const OIL_LIST_PATH = "/oil";
const MASALA_LIST_PATH = "/spices";

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
  { label: "Logout", href: "/logout-action" }
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
  }
];

export default function Logout({ selectedType, onLogout, onNavigate }) {
  const navigate = onNavigate || (() => {});

  const dynamicNavItems = [
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
    ...(selectedType === "Wholesaler" ? [{ label: "Orders", href: "/orders" }] : []),
    ...(selectedType === "Manager" ? [{ label: "Manager Dashboard", href: "/manager" }] : []),
    ...(selectedType === "Admin" ? [{ label: "Admin Dashboard", href: "/admin" }] : []),
    { label: "Contact Us", href: "#contact" },
    { label: "Logout", href: "/logout-action" }
  ];

  return (
    <div className="page-shell">
      <header className="hero-section" id="top">
        <nav className="navbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <a
            href={HOME_PATH}
            onClick={(event) => {
              event.preventDefault();
              navigate(HOME_PATH);
            }}
            style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
          >
            <div style={{
              background: "#556B2F", borderRadius: "50%", width: "42px", height: "42px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: "700", color: "#FAF7F2", fontFamily: "'Playfair Display', serif"
            }}>AA</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#2B2B2B", letterSpacing: "0.03em", fontFamily: "'Playfair Display', serif", lineHeight: "1.1" }}>Akalwadi</div>
              <div style={{ fontSize: "9px", color: "#7A8279", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "600", marginTop: "1px" }}>Associates</div>
            </div>
          </a>

          <ul className="nav-links">
            {dynamicNavItems.map((item) => (
              <li
                key={item.label}
                className={item.dropdown ? "nav-dropdown" : ""}
              >
                <a
                  href={item.href}
                  onClick={(event) => {
                    if (item.href === "/logout-action") {
                      event.preventDefault();
                      onLogout?.();
                    } else if (item.href === "/orders" || item.href === "/manager" || item.href === "/admin") {
                      event.preventDefault();
                      navigate(item.href);
                    } else if (item.href === ABOUT_PATH || item.href === HOME_PATH) {
                      event.preventDefault();
                      navigate(item.href);
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
                              navigate(sub.href);
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

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">
              {selectedType ? `${selectedType} • Logged In` : "Logged In"}
            </p>
            <h1>
              {selectedType === "Admin"
                ? "Admin Control Center"
                : selectedType === "Manager" 
                ? "Manager Administration Portal" 
                : "Welcome back to Akalwadi Associates."}
            </h1>
            <p className="hero-lead">
              {selectedType === "Admin"
                ? "You're signed in as Admin. Access analytics, manage wholesaler stores, and oversee staff operations from your control panel."
                : selectedType === "Manager"
                ? "You're signed in as a Manager. Access stock control parameters, update inventory, or dispatch wholesaler orders immediately."
                : "You're signed in. Browse our product catalogue, check business details, or get in touch — your wholesale dashboard is ready."}
            </p>

            <div className="hero-actions">
              {selectedType === "Admin" ? (
                <>
                  <a
                    href="/admin"
                    className="primary-button"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/admin");
                    }}
                  >
                    Open Admin Panel
                  </a>
                  <a
                    href={OIL_LIST_PATH}
                    className="secondary-button"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(OIL_LIST_PATH);
                    }}
                  >
                    Browse Products
                  </a>
                </>
              ) : selectedType === "Manager" ? (
                <>
                  <a
                    href="/manager"
                    className="primary-button"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/manager");
                    }}
                  >
                    Open Control Panel
                  </a>
                  <a
                    href={OIL_LIST_PATH}
                    className="secondary-button"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(OIL_LIST_PATH);
                    }}
                  >
                    Browse Oils
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={OIL_LIST_PATH}
                    className="primary-button"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(OIL_LIST_PATH);
                    }}
                  >
                    View Edible Oils
                  </a>
                  <a
                    href={MASALA_LIST_PATH}
                    className="secondary-button"
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(MASALA_LIST_PATH);
                    }}
                  >
                    View Spices
                  </a>
                  <a
                    href="/orders"
                    className="secondary-button"
                    style={{ background: "#1A1A16", color: "#fff", borderColor: "#1A1A16" }}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate("/orders");
                    }}
                  >
                    Track Orders
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card">
              <div className="hero-card-row">
                <div className="hero-tile hero-tile-oil" onClick={() => navigate(OIL_LIST_PATH)} style={{ cursor: "pointer" }}>
                  <span className="hero-tile-icon">🛢️</span>
                  <span>Edible Oil</span>
                </div>
                <div className="hero-tile hero-tile-spice" onClick={() => navigate(MASALA_LIST_PATH)} style={{ cursor: "pointer" }}>
                  <span className="hero-tile-icon">🌶️</span>
                  <span>Spices</span>
                </div>
              </div>
              <div className="hero-card-row">
                <div className="hero-tile hero-tile-supply">
                  <span className="hero-tile-icon">🚚</span>
                  <span>Daily Supply</span>
                </div>
                <div className="hero-tile hero-tile-supply">
                  <span className="hero-tile-icon">📦</span>
                  <span>Wholesale</span>
                </div>
              </div>
            </div>
            <div className="hero-glow" />
          </div>
        </div>
      </header>

      <main className="content">
        <section className="products-section" id="products">
          <div className="section-heading">
            <p className="section-eyebrow">Browse Catalogue</p>
            <h2>What we have for you</h2>
          </div>

          <div className="product-grid">
            {productCategories.map((product) => (
              <article
                className={`product-card${product.path ? " product-card-clickable" : ""}`}
                key={product.name}
                onClick={() => product.path && navigate(product.path)}
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
              Akalwadi Associates — wholesalers and distributors of oil
              and spices.
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
