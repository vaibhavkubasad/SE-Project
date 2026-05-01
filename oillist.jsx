import { useEffect, useMemo, useState } from "react";

const OIL_META = {
  Sunflower: { emoji: "🌻", tagline: "Light & heart-healthy", accent: "#E8A020", bg: "#FFF8EC", border: "#FADDAA" },
  Coconut: { emoji: "🥥", tagline: "Pure & aromatic", accent: "#1D9E75", bg: "#F0FBF6", border: "#A0DFC5" },
  Mustard: { emoji: "🟡", tagline: "Bold & traditional", accent: "#C48A0A", bg: "#FFFBEC", border: "#F5DC90" },
  Groundnut: { emoji: "🥜", tagline: "Rich & flavourful", accent: "#C0613A", bg: "#FFF4F0", border: "#F5C4B0" },
  "Rice Bran": { emoji: "🌾", tagline: "Versatile & nutritious", accent: "#7A7060", bg: "#F9F7F4", border: "#D4CFC5" }
};

const FALLBACK_META = { emoji: "🛢️", tagline: "Quality edible oil", accent: "#1D4F8F", bg: "#EEF4FB", border: "#C9DBEF" };

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function parseLitres(quantity) {
  const match = String(quantity || "").match(/([\d.]+)\s*([a-zA-Z]+)?/);
  if (!match) return 1;
  const value = parseFloat(match[1]);
  const unit = (match[2] || "L").toLowerCase();
  if (unit.startsWith("ml")) return value / 1000;
  return value;
}

function groupOils(rows) {
  const byType = new Map();
  for (const row of rows) {
    const oilType = row.oilType || "Other";
    if (!byType.has(oilType)) {
      const meta = OIL_META[oilType] || FALLBACK_META;
      byType.set(oilType, {
        id: oilType.toLowerCase().replace(/\s+/g, ""),
        name: `${oilType} Oil`,
        oilType,
        ...meta,
        brands: new Map()
      });
    }
    const oil = byType.get(oilType);
    if (!oil.brands.has(row.companyName)) {
      oil.brands.set(row.companyName, { name: row.companyName, packs: [] });
    }
    oil.brands.get(row.companyName).packs.push({
      label: row.quantity,
      litres: parseLitres(row.quantity),
      price: Number(row.price) || 0
    });
  }

  return Array.from(byType.values()).map((oil) => ({
    ...oil,
    brands: Array.from(oil.brands.values()).map((brand) => ({
      ...brand,
      packs: brand.packs.sort((a, b) => a.litres - b.litres),
      ppl: Math.round(brand.packs[0].price / Math.max(brand.packs[0].litres, 0.0001))
    }))
  }));
}

function HomePage({ oils, onSelect, cart }) {
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const grandTotal = cart.reduce((s, c) => s + c.total, 0);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", background: "#FAFAF8" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #EDEAE4", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#1A1A16", letterSpacing: "-0.3px" }}>Akalwadi Oils</div>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "system-ui" }}>Wholesale Edible Oils</div>
        </div>
        {totalItems > 0 && (
          <div style={{ background: "#1A1A16", color: "#fff", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontFamily: "system-ui" }}>
            🛒 {totalItems} items · {fmt(grandTotal)}
          </div>
        )}
      </div>

      <div style={{ padding: "40px 24px 28px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "system-ui", marginBottom: 10 }}>Select oil type</div>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 32, fontWeight: 700, color: "#1A1A16", lineHeight: 1.2, marginBottom: 8 }}>
          Premium oils.<br />Wholesale prices.
        </h1>
        <p style={{ fontSize: 14, color: "#6A6860", fontFamily: "system-ui", lineHeight: 1.6 }}>
          Choose from {oils.length} oil types. Compare brands. Order by the pack.
        </p>
      </div>

      <div style={{ padding: "0 24px 48px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {oils.map((oil, i) => (
            <OilCard key={oil.id} oil={oil} index={i} onSelect={() => onSelect(oil)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function OilCard({ oil, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const minPpl = Math.min(...oil.brands.map((b) => b.ppl));
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? oil.bg : "#fff",
        border: `1.5px solid ${hovered ? oil.border : "#EDEAE4"}`,
        borderRadius: 16,
        padding: "24px 20px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 24px ${oil.accent}22` : "none",
        animationDelay: `${index * 0.06}s`
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>{oil.emoji}</div>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, color: "#1A1A16", marginBottom: 4 }}>{oil.name}</div>
      <div style={{ fontSize: 12, color: "#8A8880", fontFamily: "system-ui", marginBottom: 16 }}>{oil.tagline}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: oil.accent, fontFamily: "system-ui", fontWeight: 600 }}>
          from {fmt(minPpl)}/L
        </div>
        <div style={{
          background: oil.accent, color: "#fff", borderRadius: 8, padding: "5px 12px",
          fontSize: 12, fontFamily: "system-ui", fontWeight: 600, opacity: hovered ? 1 : 0.85, transition: "opacity 0.2s"
        }}>
          View →
        </div>
      </div>
    </div>
  );
}

function OilDetailPage({ oil, onBack, onAddToCart, cart }) {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [qty, setQty] = useState(10);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (selectedBrand) {
      setSelectedPack(selectedBrand.packs[0] || null);
    }
  }, [selectedBrand]);

  const totalPrice = selectedPack ? qty * selectedPack.price : 0;
  const totalLitres = selectedPack ? qty * selectedPack.litres : 0;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + c.total, 0);

  function handleAdd() {
    if (!selectedBrand || !selectedPack) return;
    onAddToCart({
      id: Date.now(),
      oilName: oil.name,
      brand: selectedBrand.name,
      pack: selectedPack.label,
      packLitres: selectedPack.litres,
      packPrice: selectedPack.price,
      qty,
      totalLitres,
      total: totalPrice
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ fontFamily: "system-ui", minHeight: "100vh", background: "#FAFAF8" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #EDEAE4", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #EDEAE4", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#4A4840", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          ← All oils
        </button>
        {cartCount > 0 && (
          <div style={{ background: "#1A1A16", color: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 13 }}>
            🛒 {cartCount} · {fmt(cartTotal)}
          </div>
        )}
      </div>

      <div style={{ background: oil.bg, borderBottom: `1px solid ${oil.border}`, padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>{oil.emoji}</div>
          <div>
            <div style={{ fontSize: 11, color: oil.accent, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Edible Oil</div>
            <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700, color: "#1A1A16", margin: 0, lineHeight: 1.2 }}>{oil.name}</h2>
            <div style={{ fontSize: 13, color: "#6A6860", marginTop: 4 }}>{oil.tagline} · {oil.brands.length} brand{oil.brands.length === 1 ? "" : "s"} available</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 24px 40px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Step 1 — Choose brand</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {oil.brands.map((brand) => (
              <BrandCard
                key={brand.name}
                brand={brand}
                oil={oil}
                selected={selectedBrand?.name === brand.name}
                onSelect={() => setSelectedBrand(brand)}
              />
            ))}
          </div>
        </div>

        {selectedBrand && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Step 2 — Pack size</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {selectedBrand.packs.map((pack) => (
                <button
                  key={pack.label}
                  onClick={() => setSelectedPack(pack)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 10,
                    border: selectedPack?.label === pack.label ? `2px solid ${oil.accent}` : "1.5px solid #EDEAE4",
                    background: selectedPack?.label === pack.label ? oil.bg : "#fff",
                    color: selectedPack?.label === pack.label ? oil.accent : "#4A4840",
                    fontWeight: selectedPack?.label === pack.label ? 700 : 400,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {pack.label} — {fmt(pack.price)}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedBrand && selectedPack && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Step 3 — Quantity (number of packs)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #EDEAE4", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 42, height: 42, border: "none", background: "none", fontSize: 20, color: "#4A4840", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <input
                  type="number"
                  value={qty}
                  min={1}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: 64, height: 42, border: "none", borderLeft: "1px solid #EDEAE4", borderRight: "1px solid #EDEAE4", textAlign: "center", fontSize: 16, fontWeight: 600, color: "#1A1A16", background: "none", fontFamily: "system-ui" }}
                />
                <button onClick={() => setQty((q) => q + 1)} style={{ width: 42, height: 42, border: "none", background: "none", fontSize: 20, color: "#4A4840", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <div style={{ fontSize: 13, color: "#8A8880" }}>
                × {selectedPack.label} = <strong style={{ color: "#1A1A16" }}>{totalLitres.toLocaleString("en-IN")} L</strong>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Bill summary</div>
          <Row label="Oil type" value={oil.name} />
          <Row label="Brand" value={selectedBrand ? selectedBrand.name : <Muted>—</Muted>} />
          <Row label="Pack size" value={selectedPack ? selectedPack.label : <Muted>—</Muted>} />
          <Row label="Pack price" value={selectedPack ? fmt(selectedPack.price) : <Muted>—</Muted>} />
          <Row label="Quantity" value={selectedPack ? `${qty} × ${selectedPack.label}` : <Muted>—</Muted>} />
          <Row label="Total volume" value={selectedPack ? `${totalLitres.toLocaleString("en-IN")} L` : <Muted>—</Muted>} />
          <div style={{ borderTop: "1px solid #EDEAE4", marginTop: 12, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A16" }}>Total amount</span>
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Georgia', serif", color: selectedPack ? oil.accent : "#C0BDB8" }}>
              {selectedPack ? fmt(totalPrice) : "—"}
            </span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedBrand || !selectedPack}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: selectedBrand && selectedPack ? (added ? "#1D9E75" : oil.accent) : "#EDEAE4",
            color: selectedBrand && selectedPack ? "#fff" : "#A0A09A",
            fontSize: 15,
            fontWeight: 700,
            cursor: selectedBrand && selectedPack ? "pointer" : "not-allowed",
            fontFamily: "system-ui",
            transition: "background 0.25s",
            letterSpacing: "-0.1px"
          }}
        >
          {added ? "✓ Added to order!" : selectedBrand && selectedPack ? `Add to order · ${fmt(totalPrice)}` : "Select brand & pack to continue"}
        </button>

        {cart.length > 0 && <CartPreview cart={cart} />}
      </div>
    </div>
  );
}

function BrandCard({ brand, oil, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const minPrice = Math.min(...brand.packs.map((p) => p.price));
  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? oil.bg : hovered ? "#FAFAF8" : "#fff",
        border: selected ? `2px solid ${oil.accent}` : `1.5px solid ${hovered ? "#CCCAC5" : "#EDEAE4"}`,
        borderRadius: 12,
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.15s",
        position: "relative"
      }}
    >
      {selected && (
        <div style={{ position: "absolute", top: 10, left: 10, width: 18, height: 18, borderRadius: "50%", background: oil.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <polyline points="1,4 4,7 9,1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A16", marginBottom: 4, marginTop: selected ? 4 : 0 }}>{brand.name}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: oil.accent, fontFamily: "'Georgia', serif" }}>
        {fmt(brand.ppl)}<span style={{ fontSize: 12, color: "#8A8880", fontFamily: "system-ui", fontWeight: 400 }}>/litre</span>
      </div>
      <div style={{ fontSize: 11, color: "#8A8880", marginTop: 6 }}>
        {brand.packs.length} pack{brand.packs.length === 1 ? "" : "s"} · from {fmt(minPrice)}
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

function Muted({ children }) {
  return <span style={{ color: "#B0AEA8" }}>{children}</span>;
}

function CartPreview({ cart }) {
  const grand = cart.reduce((s, c) => s + c.total, 0);
  return (
    <div style={{ marginTop: 24, background: "#F4F2EE", borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Your order so far</div>
      {cart.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #E0DDD8" }}>
          <span style={{ color: "#4A4840" }}>{c.brand} {c.oilName} — {c.qty}×{c.pack}</span>
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

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedOil, setSelectedOil] = useState(null);
  const [cart, setCart] = useState([]);
  const [rawOils, setRawOils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/oils");
        if (!response.ok) throw new Error("Failed to load oils");
        const data = await response.json();
        if (!cancelled) {
          setRawOils(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load oils");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const oils = useMemo(() => groupOils(rawOils), [rawOils]);

  if (loading) {
    return <CenterMessage>Loading oils…</CenterMessage>;
  }

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

  if (oils.length === 0) {
    return <CenterMessage>No oils available right now.</CenterMessage>;
  }

  if (page === "detail" && selectedOil) {
    return (
      <OilDetailPage
        oil={selectedOil}
        onBack={() => setPage("home")}
        onAddToCart={(item) => setCart((prev) => [...prev, item])}
        cart={cart}
      />
    );
  }

  return (
    <HomePage
      oils={oils}
      onSelect={(oil) => {
        setSelectedOil(oil);
        setPage("detail");
      }}
      cart={cart}
    />
  );
}

function CenterMessage({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "system-ui", color: "#4A4840", padding: 24, textAlign: "center" }}>
      <div>{children}</div>
    </div>
  );
}
