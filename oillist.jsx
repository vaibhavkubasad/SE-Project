import { useEffect, useMemo, useState } from "react";

const OIL_META = {
  Sunflower: { emoji: "🌻", tagline: "Light & heart-healthy", accent: "#E8A020", bg: "#FFF8EC", border: "#FADDAA", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80" },
  Coconut: { emoji: "🥥", tagline: "Pure & aromatic", accent: "#1D9E75", bg: "#F0FBF6", border: "#A0DFC5", image: "https://images.unsplash.com/photo-1621236378699-8c4a0a9a8d39?w=400&q=80" },
  Mustard: { emoji: "🟡", tagline: "Bold & traditional", accent: "#C48A0A", bg: "#FFFBEC", border: "#F5DC90", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" },
  Groundnut: { emoji: "🥜", tagline: "Rich & flavourful", accent: "#C0613A", bg: "#FFF4F0", border: "#F5C4B0", image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&q=80" },
  "Rice Bran": { emoji: "🌾", tagline: "Versatile & nutritious", accent: "#7A7060", bg: "#F9F7F4", border: "#D4CFC5", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80" }
};

const FALLBACK_META = { emoji: "🛢️", tagline: "Quality edible oil", accent: "#1D4F8F", bg: "#EEF4FB", border: "#C9DBEF", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80" };

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function localNavigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
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

function HomePage({ oils, onSelect, cart, onPlaceOrder, placing, success }) {
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {oils.map((oil, i) => (
            <OilCard key={oil.id} oil={oil} index={i} onSelect={() => onSelect(oil)} />
          ))}
        </div>
        {(cart.length > 0 || success) && (
          <CartPreview cart={cart} onPlaceOrder={onPlaceOrder} placing={placing} success={success} />
        )}
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
      <div style={{ width: "100%", height: 120, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
        <img src={oil.image} alt={oil.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
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

function OilDetailPage({ oil, onBack, onAddToCart, cart, onPlaceOrder, placing, success }) {
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
          <div style={{ width: 80, height: 80, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
            <img src={oil.image} alt={oil.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
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

        {(cart.length > 0 || success) && (
          <CartPreview cart={cart} onPlaceOrder={onPlaceOrder} placing={placing} success={success} />
        )}
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

function CartPreview({ cart, onPlaceOrder, placing, success }) {
  const grand = cart.reduce((s, c) => s + c.total, 0);
  
  if (success) {
    return (
      <div style={{ marginTop: 24, background: "#F0FBF6", border: "1.5px solid #A0DFC5", borderRadius: 14, padding: "20px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
        <h3 style={{ color: "#1D9E75", margin: "0 0 4px", fontSize: 16 }}>Order Placed Successfully!</h3>
        <p style={{ color: "#4A4840", fontSize: 13, margin: 0 }}>Your wholesale order has been submitted. Check the **Orders** section to track it!</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24, background: "#F4F2EE", borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Your order so far</div>
      {cart.map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "0.5px solid #E0DDD8" }}>
          <span style={{ color: "#4A4840" }}>{c.brand} {c.oilName} — {c.qty}×{c.pack}</span>
          <span style={{ fontWeight: 600, color: "#1A1A16" }}>{fmt(c.total)}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderBottom: "1px solid #E0DDD8", paddingBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A16" }}>Grand total</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#1D9E75", fontFamily: "'Georgia', serif" }}>{fmt(grand)}</span>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={placing || cart.length === 0}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "none",
          background: placing ? "#8A8880" : "#1D9E75",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: placing ? "not-allowed" : "pointer",
          marginTop: 14,
          boxShadow: placing ? "none" : "0 4px 12px rgba(29, 158, 117, 0.2)",
          transition: "all 0.2s"
        }}
      >
        {placing ? "🔄 Placing Order..." : "⚡ Place Wholesale Order"}
      </button>
    </div>
  );
}

function SuccessPopup({ order, onClose }) {
  if (!order) return null;
  const grandTotal = order.totalAmount || 0;
  const shortId = order._id ? String(order._id).substring(18).toUpperCase() : "TAP-SUCCESS";
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Synthesize a beautiful digital chime that mimics standard UPI payment apps
  useEffect(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = "sine";
      const now = audioCtx.currentTime;
      // High-quality three-tone chord chime (C5 -> E5 -> G5 -> C6)
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(261.63, now); // C4
      osc2.frequency.setValueAtTime(329.63, now + 0.08); // E4
      osc2.frequency.setValueAtTime(392.00, now + 0.16); // G4
      osc2.frequency.setValueAtTime(523.25, now + 0.24); // C5

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.setValueAtTime(0.16, now + 0.24);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (err) {
      console.warn("Chime playback was blocked by browser audio policies or unsupported API:", err);
    }
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(10, 10, 10, 0.45)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes rippleRing {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>

      <div style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: "36px 32px",
        width: "90%",
        maxWidth: 400,
        textAlign: "center",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.16)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both"
      }}>
        {/* Animated Checkmark SVG (UPI Style with concentric pulsing ripples) */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, position: "relative" }}>
          <div style={{
            position: "absolute",
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "3px solid #D1F2E2",
            animation: "rippleRing 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite",
            zIndex: 1
          }} />
          <div style={{
            position: "absolute",
            width: 88,
            height: 88,
            borderRadius: "50%",
            border: "1px solid #D1F2E2",
            animation: "rippleRing 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s infinite",
            zIndex: 1
          }} />

          <div style={{
            position: "relative",
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#E6F7ED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(29, 158, 117, 0.15)",
            animation: "successPulse 1.2s 0.6s ease-in-out infinite",
            zIndex: 2
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" style={{
                strokeDasharray: 48,
                strokeDashoffset: 48,
                animation: "drawCheck 0.5s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards"
              }} />
            </svg>
          </div>
        </div>

        {/* UPI-style confirmation text */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A16", margin: "0 0 6px" }}>Order Placed Successfully</h2>
        <p style={{ fontSize: 13, color: "#8A8880", margin: "0 0 24px" }}>Order Confirmed · Payable on Delivery</p>

        {/* Large Amount Display */}
        <div style={{
          background: "#F4FDF9",
          border: "1.5px solid #D1F2E2",
          borderRadius: 18,
          padding: "16px",
          marginBottom: 24,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 11, color: "#1D9E75", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Amount to be Paid</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#1D9E75", fontFamily: "'Georgia', serif" }}>
            {fmt(grandTotal)}
          </div>
        </div>

        {/* Transaction Info Table */}
        <div style={{
          background: "#FAFAF8",
          borderRadius: 16,
          padding: "16px",
          border: "1px solid #EDEAE4",
          marginBottom: 28,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#8A8880" }}>Wholesaler</span>
            <span style={{ color: "#1A1A16", fontWeight: 600 }}>{order.wholesalerName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#8A8880" }}>Order ID</span>
            <span style={{ color: "#1A1A16", fontWeight: 600, fontFamily: "monospace" }}>{shortId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#8A8880" }}>Date & Time</span>
            <span style={{ color: "#1A1A16", fontWeight: 600 }}>{dateStr}</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1.5px solid #EDEAE4",
              background: "#ffffff",
              color: "#4A4840",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            Done
          </button>
          <button
            onClick={() => {
              onClose();
              localNavigate("/orders");
            }}
            style={{
              flex: 1.2,
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "#1D9E75",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(29, 158, 117, 0.25)",
              transition: "all 0.15s"
            }}
          >
            Track Order →
          </button>
        </div>
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
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const wholesalerName = user.name || "Guest Wholesaler";

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wholesalerName,
          items: cart,
          totalAmount: cart.reduce((s, c) => s + c.total, 0)
        })
      });

      if (!response.ok) throw new Error("Failed to submit order");
      
      const data = await response.json();
      setPlacedOrder(data.order);
      setCart([]);
    } catch (err) {
      alert("Error placing order: " + err.message);
    } finally {
      setPlacing(false);
    }
  }

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

  return (
    <>
      {page === "detail" && selectedOil ? (
        <OilDetailPage
          oil={selectedOil}
          onBack={() => setPage("home")}
          onAddToCart={(item) => setCart((prev) => [...prev, item])}
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
          placing={placing}
          success={success}
        />
      ) : (
        <HomePage
          oils={oils}
          onSelect={(oil) => {
            setSelectedOil(oil);
            setPage("detail");
          }}
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
          placing={placing}
          success={success}
        />
      )}
      {placedOrder && (
        <SuccessPopup order={placedOrder} onClose={() => setPlacedOrder(null)} />
      )}
    </>
  );
}

function CenterMessage({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF8", fontFamily: "system-ui", color: "#4A4840", padding: 24, textAlign: "center" }}>
      <div>{children}</div>
    </div>
  );
}
