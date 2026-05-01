import { useEffect, useMemo, useState } from "react";

const MASALA_META = {
  Turmeric: { emoji: "🟡", accent: "#D49B15", bg: "#FFF9E8", border: "#F0DA8F" },
  "Red Chilli": { emoji: "🌶️", accent: "#C0392B", bg: "#FFF3F0", border: "#F4C1B8" },
  "Gram Masala": { emoji: "🫙", accent: "#8C4C2F", bg: "#FBF3EE", border: "#E9C9B6" },
  "Garam Masala": { emoji: "🫙", accent: "#8C4C2F", bg: "#FBF3EE", border: "#E9C9B6" },
  "Dhaniya Powder": { emoji: "🌿", accent: "#3F8A4D", bg: "#F0F8EF", border: "#BFE0C2" },
  "Kitchen King": { emoji: "👑", accent: "#7A2E5D", bg: "#FBF0F7", border: "#E7BED7" },
  "Rasam Powder": { emoji: "🍲", accent: "#B05030", bg: "#FFF1EC", border: "#F0C7B5" },
  "Sambhar Powder": { emoji: "🥣", accent: "#A4471D", bg: "#FFF1E5", border: "#F0C5A2" },
  "Chaat Masala": { emoji: "🥗", accent: "#5C8A2F", bg: "#F4F8E8", border: "#D2E0AE" },
  "Puliyogere Powder": { emoji: "🍛", accent: "#9C5E1A", bg: "#FBF2E2", border: "#E6CB95" },
  "Egg Masala": { emoji: "🍳", accent: "#C58F1B", bg: "#FFF7E6", border: "#F0D89A" },
  "Mutton Masala": { emoji: "🥩", accent: "#8B2A2A", bg: "#FBE9E9", border: "#E5B5B5" },
  "Fish Masala": { emoji: "🐟", accent: "#1D6E8C", bg: "#E8F4F9", border: "#B6D9E5" },
  "Chicken Masala": { emoji: "🍗", accent: "#A8541F", bg: "#FCEEDF", border: "#EDC09A" }
};

const FALLBACK_META = { emoji: "🌶️", accent: "#8C4C2F", bg: "#FBF3EE", border: "#E9C9B6" };

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function parseGrams(weight) {
  const value = parseFloat(String(weight || "").replace(/[^\d.]/g, ""));
  if (Number.isNaN(value)) return 100;
  if (/kg/i.test(String(weight))) return value * 1000;
  return value;
}

function HomePage({ masalas, onSelect, cart }) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", background: "#FBF8F4" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #EDE4DC", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#1A1A16" }}>Akalwadi Spices</div>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "system-ui" }}>Wholesale Spice Range</div>
        </div>
        {totalItems > 0 && (
          <div style={{ background: "#1A1A16", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontFamily: "system-ui" }}>
            🛒 {totalItems} items · {fmt(grandTotal)}
          </div>
        )}
      </div>

      <div style={{ padding: "40px 24px 28px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "system-ui", marginBottom: 10 }}>Select spice</div>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 700, color: "#1A1A16", lineHeight: 1.2, marginBottom: 8 }}>
          Fresh spices.<br />Wholesale pricing.
        </h1>
        <p style={{ fontSize: 14, color: "#6A6860", fontFamily: "system-ui", lineHeight: 1.6 }}>
          Choose from {masalas.length} spice blends. Pick a quantity and add to your order.
        </p>
      </div>

      <div style={{ padding: "0 24px 48px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {masalas.map((spice, index) => (
            <SpiceCard key={spice.id} spice={spice} index={index} onSelect={() => onSelect(spice)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpiceCard({ spice, index, onSelect }) {
  const [hovered, setHovered] = useState(false);

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
        animationDelay: `${index * 0.06}s`
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>{spice.emoji}</div>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, color: "#1A1A16", marginBottom: 4 }}>{spice.name}</div>
      <div style={{ fontSize: 12, color: "#8A8880", fontFamily: "system-ui", marginBottom: 16 }}>{spice.weightLabel} pack</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, color: spice.accent, fontFamily: "'Georgia', serif", fontWeight: 700 }}>
          {fmt(spice.price)}
        </div>
        <div style={{ background: spice.accent, color: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontFamily: "system-ui", fontWeight: 600 }}>
          View →
        </div>
      </div>
    </div>
  );
}

function SpiceDetailPage({ spice, onBack, onAddToCart, cart }) {
  const [qty, setQty] = useState(10);
  const [added, setAdded] = useState(false);

  const totalPrice = qty * spice.price;
  const totalGrams = qty * spice.grams;
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  function handleAdd() {
    onAddToCart({
      id: Date.now(),
      name: spice.name,
      pack: spice.weightLabel,
      packPrice: spice.price,
      qty,
      totalGrams,
      total: totalPrice
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ fontFamily: "system-ui", minHeight: "100vh", background: "#FBF8F4" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #EDE4DC", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #EDE4DC", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#4A4840", cursor: "pointer" }}>
          ← All spices
        </button>
        {cartCount > 0 && (
          <div style={{ background: "#1A1A16", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 13 }}>
            🛒 {cartCount} · {fmt(cartTotal)}
          </div>
        )}
      </div>

      <div style={{ background: spice.bg, borderBottom: `1px solid ${spice.border}`, padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>{spice.emoji}</div>
          <div>
            <div style={{ fontSize: 11, color: spice.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Spices</div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700, color: "#1A1A16", margin: 0, lineHeight: 1.2 }}>{spice.name}</h2>
            <div style={{ fontSize: 13, color: "#6A6860", marginTop: 4 }}>{spice.weightLabel} pack · {fmt(spice.price)}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 24px 40px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Quantity (number of packs)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #EDE4DC", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 42, height: 42, border: "none", background: "none", fontSize: 20, color: "#4A4840", cursor: "pointer" }}>−</button>
              <input
                type="number"
                value={qty}
                min={1}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: 64, height: 42, border: "none", borderLeft: "1px solid #EDE4DC", borderRight: "1px solid #EDE4DC", textAlign: "center", fontSize: 16, fontWeight: 600, color: "#1A1A16", background: "none", fontFamily: "system-ui" }}
              />
              <button onClick={() => setQty((q) => q + 1)} style={{ width: 42, height: 42, border: "none", background: "none", fontSize: 20, color: "#4A4840", cursor: "pointer" }}>+</button>
            </div>
            <div style={{ fontSize: 13, color: "#8A8880" }}>
              × {spice.weightLabel} = <strong style={{ color: "#1A1A16" }}>{(totalGrams / 1000).toLocaleString("en-IN")} kg</strong>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #EDE4DC", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Bill summary</div>
          <Row label="Spice" value={spice.name} />
          <Row label="Pack size" value={spice.weightLabel} />
          <Row label="Pack price" value={fmt(spice.price)} />
          <Row label="Quantity" value={`${qty} × ${spice.weightLabel}`} />
          <Row label="Total weight" value={`${(totalGrams / 1000).toLocaleString("en-IN")} kg`} />
          <div style={{ borderTop: "1px solid #EDE4DC", marginTop: 12, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A16" }}>Total amount</span>
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Georgia', serif", color: spice.accent }}>{fmt(totalPrice)}</span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: added ? "#1D9E75" : spice.accent,
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "system-ui",
            transition: "background 0.25s",
            letterSpacing: "-0.1px"
          }}
        >
          {added ? "✓ Added to order!" : `Add to order · ${fmt(totalPrice)}`}
        </button>

        {cart.length > 0 && <CartPreview cart={cart} />}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6A6860", padding: "5px 0", borderBottom: "0.5px solid #F0EDE8" }}>
      <span>{label}</span>
      <span style={{ color: "#1A1A16", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function CartPreview({ cart }) {
  const grand = cart.reduce((sum, item) => sum + item.total, 0);
  return (
    <div style={{ marginTop: 24, background: "#F4F2EE", borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Your order so far</div>
      {cart.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #E0DDD8" }}>
          <span style={{ color: "#4A4840" }}>{c.name} — {c.qty}×{c.pack}</span>
          <span style={{ fontWeight: 600, color: "#1A1A16" }}>{fmt(c.total)}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A16" }}>Grand total</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1D9E75", fontFamily: "'Georgia', serif" }}>{fmt(grand)}</span>
      </div>
    </div>
  );
}

function shapeMasalas(rows) {
  return rows.map((row) => {
    const meta = MASALA_META[row.name] || FALLBACK_META;
    const grams = parseGrams(row.weight);
    const weightLabel = grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
    return {
      id: row._id || row.name,
      name: row.name,
      price: Number(row.price) || 0,
      grams,
      weightLabel,
      ...meta
    };
  });
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedSpice, setSelectedSpice] = useState(null);
  const [cart, setCart] = useState([]);
  const [rawMasalas, setRawMasalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/masalas");
        if (!response.ok) throw new Error("Failed to load masalas");
        const data = await response.json();
        if (!cancelled) {
          setRawMasalas(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load masalas");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const masalas = useMemo(() => shapeMasalas(rawMasalas), [rawMasalas]);

  if (loading) return <CenterMessage>Loading spices…</CenterMessage>;
  if (error) {
    return (
      <CenterMessage>
        <div>{error}</div>
        <div style={{ fontSize: 13, color: "#8A8880", marginTop: 8 }}>
          Make sure the API server is running (`npm run server`).
        </div>
      </CenterMessage>
    );
  }
  if (masalas.length === 0) return <CenterMessage>No spices available right now.</CenterMessage>;

  if (page === "detail" && selectedSpice) {
    return (
      <SpiceDetailPage
        spice={selectedSpice}
        onBack={() => setPage("home")}
        onAddToCart={(item) => setCart((prev) => [...prev, item])}
        cart={cart}
      />
    );
  }

  return (
    <HomePage
      masalas={masalas}
      onSelect={(spice) => {
        setSelectedSpice(spice);
        setPage("detail");
      }}
      cart={cart}
    />
  );
}

function CenterMessage({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF8F4", fontFamily: "system-ui", color: "#4A4840", padding: 24, textAlign: "center" }}>
      <div>{children}</div>
    </div>
  );
}
