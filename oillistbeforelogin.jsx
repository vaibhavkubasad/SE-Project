import { useState } from "react";

const oils = [
  {
    id: "sunflower",
    name: "Sunflower Oil",
    emoji: "🌻",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
    discount: "18% OFF",
    brands: ["Gemini", "Fortune", "Saffola", "Sundrop", "Gold Winner"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
  {
    id: "coconut",
    name: "Coconut Oil",
    emoji: "🥥",
    image: "https://images.unsplash.com/photo-1621236378699-8c4a0a9a8d39?w=400&q=80",
    discount: "12% OFF",
    brands: ["Parachute", "KLF Nirmal", "Coco Soul", "Marico", "Patanjali"],
    sizes: ["500 ml", "1 L", "2 L", "5 L", "15 L"],
  },
  {
    id: "mustard",
    name: "Mustard Oil",
    emoji: "🫙",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
    discount: "22% OFF",
    brands: ["Patanjali", "Engine", "Dhara", "Fortune", "Borges"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
  {
    id: "groundnut",
    name: "Groundnut Oil",
    emoji: "🥜",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80",
    discount: "15% OFF",
    brands: ["Fortune", "Sundrop", "Gokul", "Ceres", "Rajam"],
    sizes: ["1 L", "2 L", "5 L", "15 L", "50 L"],
  },
  {
    id: "ricebran",
    name: "Rice Bran Oil",
    emoji: "🌾",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80",
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
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, padding: "32px 28px", width: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)", textAlign: "center",
          animation: "popIn 0.2s ease",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔒</div>
        <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#1A1A16", marginBottom: 8 }}>
          Login Required
        </h2>
        <p style={{ fontSize: 14, color: "#6A6860", lineHeight: 1.6, marginBottom: 6 }}>
          You are not logged in.
        </p>
        <p style={{ fontSize: 13, color: "#8A8880", lineHeight: 1.6, marginBottom: 24 }}>
          Please log in to view wholesale prices and add items to your order.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #EDEAE4",
              background: "#fff", fontSize: 14, fontWeight: 600, color: "#4A4840", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "11px", borderRadius: 10, border: "none",
              background: "#3A7D0A", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
            }}
          >
            Login / Sign Up
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
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: "1px solid #EDEAE4", display: "flex", flexDirection: "column",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      {/* Image area */}
      <div style={{ position: "relative", background: "#F8F6F0", padding: "28px 16px 20px", textAlign: "center" }}>
        <div style={{
          position: "absolute", top: 10, left: 0,
          background: "#3A7D0A", color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "4px 10px",
          borderRadius: "0 6px 6px 0", letterSpacing: "0.03em",
        }}>{oil.discount}</div>
        <div style={{ fontSize: 64, lineHeight: 1 }}>
          <img src={oil.image} alt={oil.name} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8 }} />
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, color: "#3A7D0A", fontWeight: 700,
          marginTop: 10, background: "#EEF8E6", padding: "3px 10px", borderRadius: 999,
        }}>
          ⚡ 10 MINS
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 0" }}>
        <div style={{ fontSize: 11, color: "#8A8880", marginBottom: 2 }}>fresho!</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A16", marginBottom: 12, lineHeight: 1.3 }}>{oil.name}</div>

        {/* Brand dropdown */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 11, color: "#8A8880", display: "block", marginBottom: 4 }}>Brand</label>
          <select
            value={brand}
            onChange={e => setBrand(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px", borderRadius: 8,
              border: "1px solid #DEDAD4", fontSize: 13, color: "#1A1A16",
              background: "#FAFAF8", cursor: "pointer", fontFamily: "system-ui",
            }}
          >
            {oil.brands.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        {/* Size dropdown */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "#8A8880", display: "block", marginBottom: 4 }}>Pack size</label>
          <select
            value={size}
            onChange={e => setSize(e.target.value)}
            style={{
              width: "100%", padding: "7px 10px", borderRadius: 8,
              border: "1px solid #DEDAD4", fontSize: 13, color: "#1A1A16",
              background: "#FAFAF8", cursor: "pointer", fontFamily: "system-ui",
            }}
          >
            {oil.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Price hidden */}
        <div style={{
          background: "#F4F2EE", borderRadius: 8, padding: "9px 12px",
          fontSize: 12, color: "#8A8880", display: "flex", alignItems: "center", gap: 6, marginBottom: 14,
        }}>
          🔒 <span>Login to view price</span>
        </div>
      </div>

      {/* Bottom: qty + add */}
      <div style={{ padding: "0 14px 14px", marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        {/* Bookmark */}
        <button style={{
          width: 38, height: 38, borderRadius: 8, border: "1px solid #DEDAD4",
          background: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>🔖</button>

        {/* Qty */}
        <div style={{
          display: "flex", alignItems: "center", border: "1px solid #DEDAD4",
          borderRadius: 8, overflow: "hidden", flexShrink: 0,
        }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 38, border: "none", background: "#F4F2EE", fontSize: 16, cursor: "pointer", color: "#3A7D0A", fontWeight: 700 }}>−</button>
          <span style={{ width: 28, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#1A1A16" }}>{qty}</span>
          <button onClick={() => setQty(q => q + 1)} style={{ width: 28, height: 38, border: "none", background: "#F4F2EE", fontSize: 16, cursor: "pointer", color: "#3A7D0A", fontWeight: 700 }}>+</button>
        </div>

        {/* Add */}
        <button
          onClick={() => onAdd()}
          style={{
            flex: 1, height: 38, borderRadius: 8,
            border: "1.5px solid #D32F2F", background: "#fff",
            color: "#D32F2F", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "system-ui", letterSpacing: "0.02em",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.target.background = "#FFF0F0"; e.target.style.background = "#FFF5F5"; }}
          onMouseLeave={e => { e.target.style.background = "#fff"; }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#F2F0EB" }}>
      <style>{`@keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}

      {/* Top nav — blinkit style */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #EDEAE4",
        padding: "10px 24px", display: "flex", alignItems: "center",
        gap: 16, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{
          background: "#F5C518", borderRadius: 10, width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900, color: "#1A1A16", flexShrink: 0,
        }}>🛢</div>

        {/* Category btn */}
        <div style={{
          background: "#3A7D0A", color: "#fff", borderRadius: 8,
          padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
        }}>
          Shop by Category ▾
        </div>

        {/* Search */}
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8A8880", fontSize: 16 }}>🔍</span>
          <input
            placeholder="Search for Oils..."
            style={{
              width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8,
              border: "1px solid #EDEAE4", background: "#F8F6F0", fontSize: 14,
              color: "#1A1A16", fontFamily: "system-ui", outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Delivery */}
        <div style={{
          background: "#EEF8E6", border: "1px solid #CCEAAA", borderRadius: 8,
          padding: "7px 14px", textAlign: "center", flexShrink: 0,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#3A7D0A" }}>⚡ Delivery in 10 mins</div>
          <div style={{ fontSize: 11, color: "#6A8A50" }}>Select Location</div>
        </div>

        {/* Login btn */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "8px 18px", borderRadius: 8, border: "1.5px solid #3A7D0A",
            background: "#fff", color: "#3A7D0A", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          }}
        >
          Login
        </button>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 48px" }}>

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{
              fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700,
              color: "#1A1A16", margin: 0, marginBottom: 4,
            }}>Edible Oils</h1>
            <p style={{ fontSize: 13, color: "#8A8880", margin: 0 }}>
              Wholesale quantities · Login to view prices
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #DEDAD4", background: "#fff", fontSize: 16, cursor: "pointer" }}>‹</button>
            <button style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid #DEDAD4", background: "#fff", fontSize: 16, cursor: "pointer" }}>›</button>
          </div>
        </div>

        {/* Login banner */}
        <div style={{
          background: "#FFF8EC", border: "1px solid #FAD97A", borderRadius: 12,
          padding: "13px 18px", marginBottom: 24, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <span style={{ fontSize: 13, color: "#6A4A10" }}>
              <strong>Wholesale prices are hidden.</strong> Login or create an account to see prices and place bulk orders.
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "7px 18px", borderRadius: 8, border: "none",
              background: "#E8960A", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
            }}
          >
            Login now
          </button>
        </div>

        {/* Oil cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {oils.map(oil => (
            <OilCard key={oil.id} oil={oil} onAdd={() => setShowModal(true)} />
          ))}
        </div>
      </div>
    </div>
  );
}