import { useEffect, useState } from "react";
import { getMasalaImage } from "./masalaImages";

const DEFAULT_MASALAS = [
  { id: "chicken", name: "Chicken Masala", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    sizes: ["50g", "100g", "200g", "500g"], cat: "Spice Blends" },
  { id: "mutton", name: "Mutton Masala", image: "/mutton.jpeg",
    sizes: ["50g", "100g", "200g", "500g"], cat: "Spice Blends" },
  { id: "kabab", name: "Kabab Masala", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&q=80",
    sizes: ["50g", "100g", "200g", "500g"], cat: "Spice Blends" },
  { id: "dhania", name: "Dhania Powder", image: "https://images.unsplash.com/photo-1599909533601-fc01a2d5e9a7?w=400&q=80",
    sizes: ["100g", "200g", "500g", "1kg"], cat: "Powder" },
  { id: "redchilli", name: "Red Chilli Powder", image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&q=80",
    sizes: ["100g", "200g", "500g", "1kg"], cat: "Powder" },
  { id: "turmeric", name: "Turmeric Powder", image: "/turmeric.jpeg",
    sizes: ["100g", "200g", "500g", "1kg"], cat: "Powder" },
  { id: "garam", name: "Garam Masala", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    sizes: ["50g", "100g", "200g", "500g"], cat: "Spice Blends" },
  { id: "rasam", name: "Rasam Powder", image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&q=80",
    sizes: ["50g", "100g", "200g", "500g"], cat: "Spice Blends" },
  { id: "sambar", name: "Sambar Powder", image: "/sambar.jpeg",
    sizes: ["50g", "100g", "200g", "500g"], cat: "Spice Blends" },
];

const categories = ["All", "Powder", "Spice Blends"];

function inferMasalaCategory(name) {
  return /powder|chilli|chili|turmeric|dhania|dhaniya|dhainya|coriander/i.test(String(name || ""))
    ? "Powder"
    : "Spice Blends";
}

function isPlaceholderMasalaImage(image) {
  const value = String(image || "");
  return !value || value.includes("images.unsplash.com") || value === "/spices_category.jpg" || value === "/spices_category.png";
}

function shapeCatalogMasala(row) {
  const name = row.name || "Masala";
  const pack = row.weight || row.pack || row.quantity;
  const image = isPlaceholderMasalaImage(row.image)
    ? getMasalaImage(name, row.image || "/spices_category.jpg")
    : row.image;

  return {
    id: row._id || row.id || `${name}-${pack || "default"}`,
    name,
    image,
    sizes: row.sizes || (pack ? [pack] : ["100g", "200g", "500g", "1kg"]),
    cat: row.cat || inferMasalaCategory(name)
  };
}

function handleMasalaImageError(event) {
  if (!event.currentTarget.src.endsWith("/spices_category.jpg")) {
    event.currentTarget.src = "/spices_category.jpg";
  }
}

function LoginModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(27,41,26,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        backdropFilter: "blur(4px)"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#FAF7F2", borderRadius: 16, padding: "36px 32px", width: 360,
          boxShadow: "0 24px 64px rgba(85,107,47,0.15)", textAlign: "center",
          border: "1px solid rgba(85,107,47,0.12)",
          fontFamily: "'Poppins', sans-serif"
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800, color: "#2B2B2B", marginBottom: 10 }}>
          Login Required
        </h2>
        <p style={{ fontSize: 14, color: "#4B524A", lineHeight: 1.6, marginBottom: 6 }}>
          You are not logged in.
        </p>
        <p style={{ fontSize: 13, color: "#7A8279", lineHeight: 1.6, marginBottom: 28 }}>
          Please log in as a Wholesaler to view wholesale pricing and place bulk orders.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "12px", borderRadius: 8, border: "1.5px solid #556B2F",
              background: "transparent", fontSize: 14, fontWeight: 700, color: "#556B2F", cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClose();
              window.history.pushState({}, "", "/usertype");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
            style={{
              flex: 1, padding: "12px", borderRadius: 8, border: "none",
              background: "#556B2F", fontSize: 14, fontWeight: 700, color: "#FAF7F2", cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
}

function MasalaCard({ item, onAdd }) {
  const [size, setSize] = useState(item.sizes[1] || item.sizes[0]);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(85,107,47,0.12)", display: "flex", flexDirection: "column",
      boxShadow: "0 4px 15px rgba(85,107,47,0.01)", transition: "all 0.2s ease-in-out",
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Image area */}
      <div style={{ position: "relative", background: "#FAF7F2", overflow: "hidden", height: 160 }}>
        <img src={item.image} alt={item.name} onError={handleMasalaImageError} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 0", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, color: "#7A8279", marginBottom: 4, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Wholesale Spices</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#2B2B2B", marginBottom: 14, lineHeight: 1.4, fontFamily: "'Montserrat', sans-serif", flexGrow: 1 }}>{item.name}</div>

        {/* Pack size */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#7A8279", display: "block", marginBottom: 4, fontWeight: 500 }}>Pack size</label>
          <select
            value={size}
            onChange={e => setSize(e.target.value)}
            style={{
              width: "100%", padding: "8px 10px", borderRadius: 6,
              border: "1px solid rgba(85,107,47,0.15)", fontSize: 13, color: "#2B2B2B",
              background: "#FAF7F2", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
            }}
          >
            {item.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Price hidden */}
        <div
          onClick={onAdd}
          style={{
            background: "#E8EDE4", border: "1px solid rgba(85,107,47,0.15)", borderRadius: 6, padding: "10px 12px",
            fontSize: 12, color: "#556B2F", display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
            fontWeight: 600, cursor: "pointer"
          }}
        >
          🔒 <span>Login to view wholesale prices</span>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: "0 20px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        {/* Bookmark */}
        <button
          onClick={onAdd}
          style={{
            width: 38, height: 38, borderRadius: 6, border: "1px solid rgba(85,107,47,0.15)",
            background: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >🔖</button>

        {/* Add */}
        <button
          onClick={onAdd}
          style={{
            flex: 1, height: 38, borderRadius: 6,
            border: "1.5px solid #556B2F", background: "transparent",
            color: "#556B2F", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.02em",
            transition: "all 0.2s",
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function MasalaListBeforeLogin() {
  const [masalas, setMasalas] = useState(() => DEFAULT_MASALAS.map(shapeCatalogMasala));
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMasalas() {
      try {
        const response = await fetch("/api/masalas");
        if (!response.ok) throw new Error("Failed to load masalas");
        const data = await response.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setMasalas(data.map(shapeCatalogMasala));
        }
      } catch {
        if (!cancelled) {
          setMasalas(DEFAULT_MASALAS.map(shapeCatalogMasala));
        }
      }
    }

    fetchMasalas();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = masalas.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || m.cat === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", fontFamily: "'Poppins', sans-serif" }}>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      {/* Header Container */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(250, 247, 242, 0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(85,107,47,0.12)", padding: "14px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }
            }}
            style={{
              background: "#FAF7F2", color: "#556B2F", border: "1px solid #556B2F",
              padding: "6px 14px", borderRadius: "20px", fontWeight: "600",
              cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontSize: "12px",
              display: "flex", alignItems: "center", gap: "4px"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#556B2F"; e.target.style.color = "#FAF7F2"; }}
            onMouseLeave={(e) => { e.target.style.background = "#FAF7F2"; e.target.style.color = "#556B2F"; }}
          >
            ← Back
          </button>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
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
        </div>

        {/* Action */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 20px", borderRadius: 20, border: "1.5px solid #556B2F",
            background: "transparent", color: "#556B2F", fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s"
          }}
        >
          Wholesaler Login
        </button>
      </div>

      {/* Page Body */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px 60px" }}>
        
        {/* Title & Controls */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 30 }}>
          <div>
            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 32, fontWeight: 800, color: "#2B2B2B", margin: 0, marginBottom: 6 }}>
              Premium Heritage Spices
            </h1>
            <p style={{ fontSize: 14, color: "#7A8279", margin: 0 }}>
              Pure ground and whole spices milled to precision. Login to view wholesale rates and bulk specifications.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", minWidth: 260 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7A8279", fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search spices..."
              style={{
                width: "100%", padding: "10px 12px 10px 36px", borderRadius: 8,
                border: "1px solid rgba(85,107,47,0.15)", background: "#FAF7F2", fontSize: 13,
                color: "#2B2B2B", fontFamily: "'Poppins', sans-serif", boxSizing: "border-box", outline: "none"
              }}
            />
          </div>
        </div>

        {/* Warning Banner */}
        <div style={{
          background: "#FAF7F2", border: "1.5px solid #D4A017", borderRadius: 12,
          padding: "16px 20px", marginBottom: 30, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, boxShadow: "0 4px 15px rgba(212,160,23,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <span style={{ fontSize: 13, color: "#2B2B2B", lineHeight: 1.6 }}>
              <strong>B2B wholesale pricing is hidden.</strong> If you are a registered partner, please log in. New partners can contact us directly.
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "8px 18px", borderRadius: 6, border: "none",
              background: "#D4A017", color: "#FAF7F2", fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif", transition: "all 0.2s"
            }}
          >
            Login Now
          </button>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 20px", borderRadius: 99,
                border: activeCategory === cat ? "none" : "1px solid rgba(85,107,47,0.15)",
                background: activeCategory === cat ? "#556B2F" : "#fff",
                color: activeCategory === cat ? "#FAF7F2" : "#4B524A",
                fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7A8279", fontSize: 15 }}>
            No spices found matching your search.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {filtered.map(item => (
              <MasalaCard key={item.id} item={item} onAdd={() => setShowModal(true)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
