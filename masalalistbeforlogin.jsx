import { useEffect, useMemo, useState } from "react";

const MASALA_META = {
  Chicken: { emoji: "🍗", accent: "#A8541F", bg: "#FCEEDF", border: "#EDC09A", image: "/chicken_masala.png" },
  Mutton: { emoji: "🥩", accent: "#8B2A2A", bg: "#FBE9E9", border: "#E5B5B5", image: "/mutton_masala.png" },
  Kabab: { emoji: "🫙", accent: "#8C4C2F", bg: "#FBF3EE", border: "#E9C9B6", image: "/kabab_masala.png" },
  Dhania: { emoji: "🌿", accent: "#3F8A4D", bg: "#F0F8EF", border: "#BFE0C2", image: "/dhania_powder.png" },
  "Red Chilli": { emoji: "🌶️", accent: "#C0392B", bg: "#FFF3F0", border: "#F4C1B8", image: "/red_chilli_powder.png" },
  Turmeric: { emoji: "🟡", accent: "#D49B15", bg: "#FFF9E8", border: "#F0DA8F", image: "/turmeric_powder.png" },
  "Garam Masala": { emoji: "🫙", accent: "#7A2E5D", bg: "#FBF0F7", border: "#E7BED7", image: "/garam_masala.png" },
  Rasam: { emoji: "🍲", accent: "#B05030", bg: "#FFF1EC", border: "#F0C7B5", image: "/rasam_powder.png" },
  Sambar: { emoji: "🥣", accent: "#A4471D", bg: "#FFF1E5", border: "#F0C5A2", image: "/sambar_powder.png" }
};

const FALLBACK_META = { emoji: "🌶️", accent: "#8C4C2F", bg: "#FBF3EE", border: "#E9C9B6", image: "/spices_category.jpg" };

const FALLBACK_MASALAS_RAW = [
  { name: "Chicken", weight: "500g", price: 135 },
  { name: "Chicken", weight: "200g", price: 60 },
  { name: "Mutton", weight: "200g", price: 35 },
  { name: "Mutton", weight: "500g", price: 140 },
  { name: "Kabab", weight: "500g", price: 100 },
  { name: "Kabab", weight: "200g", price: 22 },
  { name: "Dhania", weight: "200g", price: 40 },
  { name: "Dhania", weight: "500g", price: 90 },
  { name: "Red Chilli", weight: "500g", price: 115 },
  { name: "Red Chilli", weight: "200g", price: 46 },
  { name: "Turmeric", weight: "500g", price: 110 },
  { name: "Turmeric", weight: "200g", price: 44 },
  { name: "Garam Masala", weight: "500g", price: 145 },
  { name: "Garam Masala", weight: "200g", price: 55 },
  { name: "Rasam", weight: "500g", price: 175 },
  { name: "Rasam", weight: "200g", price: 65 },
  { name: "Sambar", weight: "500g", price: 170 },
  { name: "Sambar", weight: "200g", price: 75 }
];

const categories = ["All", "Powder", "Spice Blends"];

function parseGrams(weight) {
  const value = parseFloat(String(weight || "").replace(/[^\d.]/g, ""));
  if (Number.isNaN(value)) return 100;
  if (/kg/i.test(String(weight))) return value * 1000;
  return value;
}

function groupMasalas(rows) {
  const byName = new Map();
  for (const row of rows) {
    const name = row.name;
    if (!byName.has(name)) {
      const meta = MASALA_META[name] || FALLBACK_META;
      const isPowder = ["dhania", "red chilli", "turmeric", "tumeric powder"].includes(name.toLowerCase());
      byName.set(name, {
        id: name.toLowerCase().replace(/\s+/g, ""),
        name,
        cat: isPowder ? "Powder" : "Spice Blends",
        ...meta,
        image: row.image || meta.image,
        packs: []
      });
    }
    const masala = byName.get(name);
    if (row.image) {
      masala.image = row.image;
    }
    const grams = parseGrams(row.weight);
    const weightLabel = grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
    masala.packs.push({
      label: weightLabel,
      grams
    });
  }

  return Array.from(byName.values()).map((masala) => {
    masala.packs.sort((a, b) => a.grams - b.grams);
    return masala;
  });
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

function SpiceCard({ spice, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const sizesLabel = spice.packs.map(p => p.label).join(", ");

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? spice.bg : "#fff",
        border: `1.5px solid ${hovered ? spice.border : "#EDEAE4"}`,
        borderRadius: 16,
        padding: "24px 20px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${spice.accent}22` : "none",
        animationDelay: `${index * 0.06}s`,
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <div style={{ width: "100%", height: 100, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
        <img src={spice.image} alt={spice.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, color: "#1A1A16", marginBottom: 4 }}>{spice.name}</div>
      <div style={{ fontSize: 12, color: "#8A8880", fontFamily: "system-ui", marginBottom: 16 }}>{sizesLabel} pack</div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#8A8880", fontFamily: "system-ui", fontWeight: 600 }}>
          🔒 Prices hidden
        </div>
        <div style={{ background: spice.accent, color: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontFamily: "system-ui", fontWeight: 600 }}>
          View →
        </div>
      </div>
    </div>
  );
}

export default function MasalaListBeforeLogin() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [rawMasalas, setRawMasalas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/masalas");
        if (!response.ok) throw new Error("Failed to load");
        const data = await response.json();
        setRawMasalas(data);
      } catch (err) {
        // Fallback to local hardcoded database list if offline
        setRawMasalas(FALLBACK_MASALAS_RAW);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const masalas = useMemo(() => groupMasalas(rawMasalas), [rawMasalas]);

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7A8279", fontSize: 15 }}>
            Loading spices...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7A8279", fontSize: 15 }}>
            No spices found matching your search.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {filtered.map(item => (
              <SpiceCard key={item.id} spice={item} onSelect={() => setShowModal(true)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}