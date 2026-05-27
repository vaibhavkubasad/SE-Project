import { useState } from "react";
import { getOilTypeImage } from "./oilTypeImages";

const oils = [
  {
    id: "sunflower",
    name: "Sunflower Oil",
    emoji: "🌻",
    image: getOilTypeImage("Sunflower"),
    discount: "18% OFF",
    brands: ["Gemini", "Fortune", "Saffola", "Sundrop", "Gold Winner"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
  {
    id: "coconut",
    name: "Coconut Oil",
    emoji: "🥥",
    image: getOilTypeImage("Coconut"),
    discount: "12% OFF",
    brands: ["Parachute", "KLF Nirmal", "Coco Soul", "Marico", "Patanjali"],
    sizes: ["500 ml", "1 L", "2 L", "5 L", "15 L"],
  },
  {
    id: "mustard",
    name: "Mustard Oil",
    emoji: "🫙",
    image: getOilTypeImage("Mustard"),
    discount: "22% OFF",
    brands: ["Patanjali", "Engine", "Dhara", "Fortune", "Borges"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
  {
    id: "groundnut",
    name: "Groundnut Oil",
    emoji: "🥜",
    image: getOilTypeImage("Groundnut"),
    discount: "15% OFF",
    brands: ["Fortune", "Sundrop", "Gokul", "Ceres", "Rajam"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
  {
    id: "ricebran",
    name: "Rice Bran Oil",
    emoji: "🌾",
    image: getOilTypeImage("Rice Bran"),
    discount: "20% OFF",
    brands: ["Fortune", "Saffola", "Nutrela", "Vitalife", "Rice Bran Health"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
];

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

function OilCard({ oil, onAdd }) {
  const [brand, setBrand] = useState(oil.brands[0]);
  const [size, setSize] = useState(oil.sizes[1]);
  const [qty, setQty] = useState(1);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(85,107,47,0.12)", display: "flex", flexDirection: "column",
      boxShadow: "0 4px 15px rgba(85,107,47,0.01)", transition: "all 0.2s ease-in-out",
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Image area */}
      <div style={{ position: "relative", background: "#FAF7F2", padding: "0px", textAlign: "center", overflow: "hidden", height: 160 }}>
        <div style={{
          position: "absolute", top: 12, left: 12,
          background: "#D4A017", color: "#FAF7F2",
          fontSize: 11, fontWeight: 700, padding: "4px 10px",
          borderRadius: 4, letterSpacing: "0.03em", zIndex: 2
        }}>{oil.discount}</div>
        <img src={oil.image} alt={oil.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 0", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11, color: "#7A8279", marginBottom: 4, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Premium Oils</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#2B2B2B", marginBottom: 14, lineHeight: 1.4, fontFamily: "'Montserrat', sans-serif", flexGrow: 1 }}>{oil.name}</div>

        {/* Brand dropdown */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: "#7A8279", display: "block", marginBottom: 4, fontWeight: 500 }}>Brand</label>
          <select
            value={brand}
            onChange={e => setBrand(e.target.value)}
            style={{
              width: "100%", padding: "8px 10px", borderRadius: 6,
              border: "1px solid rgba(85,107,47,0.15)", fontSize: 13, color: "#2B2B2B",
              background: "#FAF7F2", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
            }}
          >
            {oil.brands.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* Size dropdown */}
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
            {oil.sizes.map(s => <option key={s}>{s}</option>)}
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

      {/* Bottom: qty + add */}
      <div style={{ padding: "0 20px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        {/* Bookmark */}
        <button
          onClick={onAdd}
          style={{
            width: 38, height: 38, borderRadius: 6, border: "1px solid rgba(85,107,47,0.15)",
            background: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >🔖</button>

        {/* Qty */}
        <div style={{
          display: "flex", alignItems: "center", border: "1px solid rgba(85,107,47,0.15)",
          borderRadius: 6, overflow: "hidden", flexShrink: 0,
        }}>
          <button onClick={onAdd} style={{ width: 28, height: 38, border: "none", background: "#E8EDE4", fontSize: 16, cursor: "pointer", color: "#556B2F", fontWeight: 700 }}>−</button>
          <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#2B2B2B" }}>{qty}</span>
          <button onClick={onAdd} style={{ width: 28, height: 38, border: "none", background: "#E8EDE4", fontSize: 16, cursor: "pointer", color: "#556B2F", fontWeight: 700 }}>+</button>
        </div>

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

export default function OilListBeforeLogin() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = oils.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

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
              Premium Edible Oils
            </h1>
            <p style={{ fontSize: 14, color: "#7A8279", margin: 0 }}>
              Single-origin cold-pressed and refined oils of superior purity. Login to view wholesale rates and bulk specifications.
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", minWidth: 260 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7A8279", fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search oils..."
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

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7A8279", fontSize: 15 }}>
            No oils found matching your search.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
            {filtered.map(oil => (
              <OilCard key={oil.id} oil={oil} onAdd={() => setShowModal(true)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
