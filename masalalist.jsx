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

const FALLBACK_META = { emoji: "🌶️", accent: "#8C4C2F", bg: "#FBF3EE", border: "#E9C9B6", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" };

function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function localNavigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function parseGrams(weight) {
  const value = parseFloat(String(weight || "").replace(/[^\d.]/g, ""));
  if (Number.isNaN(value)) return 100;
  if (/kg/i.test(String(weight))) return value * 1000;
  return value;
}

function HomePage({ masalas, onSelect, cart, onPlaceOrder, placing, success }) {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const grandTotal = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", background: "#FBF8F4" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #EDE4DC", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                localNavigate("/");
              }
            }}
            style={{
              background: "#FAFAF8", color: "#1A1A16", border: "1px solid #EDEAE4",
              padding: "6px 14px", borderRadius: "20px", fontWeight: "600",
              cursor: "pointer", fontFamily: "system-ui", fontSize: "13px",
              display: "flex", alignItems: "center", gap: "4px"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#EDEAE4"; }}
            onMouseLeave={(e) => { e.target.style.background = "#FAFAF8"; }}
          >
            ← Back
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => localNavigate("/")}>
            <div style={{
              background: "#556B2F", borderRadius: "50%", width: "42px", height: "42px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", fontWeight: "700", color: "#FAF7F2", fontFamily: "'Playfair Display', serif"
            }}>AA</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "#2B2B2B", letterSpacing: "0.03em", fontFamily: "'Playfair Display', serif", lineHeight: "1.1" }}>Akalwadi</div>
              <div style={{ fontSize: "9px", color: "#7A8279", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "600", marginTop: "1px" }}>Associates</div>
            </div>
          </div>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {masalas.map((spice, index) => (
            <SpiceCard key={spice.id} spice={spice} index={index} onSelect={() => onSelect(spice)} />
          ))}
        </div>
        {(cart.length > 0 || success) && (
          <CartPreview cart={cart} onPlaceOrder={onPlaceOrder} placing={placing} success={success} />
        )}
      </div>
    </div>
  );
}

function SpiceCard({ spice, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const minPrice = Math.min(...spice.packs.map((p) => p.price));
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
        animationDelay: `${index * 0.06}s`
      }}
    >
      <div style={{ width: "100%", height: 100, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
        <img src={spice.image} alt={spice.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, color: "#1A1A16", marginBottom: 4 }}>{spice.name}</div>
      <div style={{ fontSize: 12, color: "#8A8880", fontFamily: "system-ui", marginBottom: 16 }}>{sizesLabel} pack</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, color: spice.accent, fontFamily: "'Georgia', serif", fontWeight: 700 }}>
          from {fmt(minPrice)}
        </div>
        <div style={{ background: spice.accent, color: "#fff", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontFamily: "system-ui", fontWeight: 600 }}>
          View →
        </div>
      </div>
    </div>
  );
}

function SpiceDetailPage({ spice, onBack, onAddToCart, cart, onPlaceOrder, placing, success }) {
  const [selectedPack, setSelectedPack] = useState(spice.packs[0] || null);
  const [qty, setQty] = useState(10);
  const [added, setAdded] = useState(false);

  const totalPrice = selectedPack ? qty * selectedPack.price : 0;
  const totalGrams = selectedPack ? qty * selectedPack.grams : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  function handleAdd() {
    if (!selectedPack) return;
    onAddToCart({
      id: Date.now(),
      name: spice.name,
      pack: selectedPack.label,
      packPrice: selectedPack.price,
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
            <div style={{ fontSize: 13, color: "#6A6860", marginTop: 4 }}>{spice.packs.length} size{spice.packs.length === 1 ? "" : "s"} available</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 24px 40px" }}>
        {/* Step 1: Pack size selection */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Step 1 — Pack size</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {spice.packs.map((pack) => (
              <button
                key={pack.label}
                onClick={() => setSelectedPack(pack)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: selectedPack?.label === pack.label ? `2px solid ${spice.accent}` : "1.5px solid #EDE4DC",
                  background: selectedPack?.label === pack.label ? spice.bg : "#fff",
                  color: selectedPack?.label === pack.label ? spice.accent : "#4A4840",
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

        {selectedPack && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Step 2 — Quantity (number of packs)</div>
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
                × {selectedPack.label} = <strong style={{ color: "#1A1A16" }}>{(totalGrams / 1000).toLocaleString("en-IN")} kg</strong>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: "#fff", border: "1.5px solid #EDE4DC", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Bill summary</div>
          <Row label="Spice" value={spice.name} />
          <Row label="Pack size" value={selectedPack ? selectedPack.label : "—"} />
          <Row label="Pack price" value={selectedPack ? fmt(selectedPack.price) : "—"} />
          <Row label="Quantity" value={selectedPack ? `${qty} × ${selectedPack.label}` : "—"} />
          <Row label="Total weight" value={selectedPack ? `${(totalGrams / 1000).toLocaleString("en-IN")} kg` : "—"} />
          <div style={{ borderTop: "1px solid #EDE4DC", marginTop: 12, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A16" }}>Total amount</span>
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Georgia', serif", color: selectedPack ? spice.accent : "#C0BDB8" }}>{selectedPack ? fmt(totalPrice) : "—"}</span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedPack}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: selectedPack ? (added ? "#1D9E75" : spice.accent) : "#EDEAE4",
            color: selectedPack ? "#fff" : "#A0A09A",
            fontSize: 15,
            fontWeight: 700,
            cursor: selectedPack ? "pointer" : "not-allowed",
            fontFamily: "system-ui",
            transition: "background 0.25s",
            letterSpacing: "-0.1px"
          }}
        >
          {added ? "✓ Added to order!" : selectedPack ? `Add to order · ${fmt(totalPrice)}` : "Select pack to continue"}
        </button>

        {(cart.length > 0 || success) && (
          <CartPreview cart={cart} onPlaceOrder={onPlaceOrder} placing={placing} success={success} />
        )}
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

function CartPreview({ cart, onPlaceOrder, placing, success }) {
  const grand = cart.reduce((sum, item) => sum + item.total, 0);

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
          <span style={{ color: "#4A4840" }}>{c.name} — {c.qty}×{c.pack}</span>
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

function groupMasalas(rows) {
  const byName = new Map();
  for (const row of rows) {
    const name = row.name;
    if (!byName.has(name)) {
      const meta = MASALA_META[name] || FALLBACK_META;
      byName.set(name, {
        id: name.toLowerCase().replace(/\s+/g, ""),
        name,
        ...meta,
        image: row.image || meta.image,
        packs: []
      });
    }
    const masala = byName.get(name);
    // Prefer row image if present
    if (row.image) {
      masala.image = row.image;
    }
    const grams = parseGrams(row.weight);
    const weightLabel = grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
    masala.packs.push({
      label: weightLabel,
      grams,
      price: Number(row.price) || 0
    });
  }

  return Array.from(byName.values()).map((masala) => {
    masala.packs.sort((a, b) => a.grams - b.grams);
    return masala;
  });
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
  const [selectedSpice, setSelectedSpice] = useState(null);
  const [cart, setCart] = useState([]);
  const [rawMasalas, setRawMasalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

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

  const masalas = useMemo(() => groupMasalas(rawMasalas), [rawMasalas]);

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

  return (
    <>
      {page === "detail" && selectedSpice ? (
        <SpiceDetailPage
          spice={selectedSpice}
          onBack={() => setPage("home")}
          onAddToCart={(item) => setCart((prev) => [...prev, item])}
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
          placing={placing}
          success={success}
        />
      ) : (
        <HomePage
          masalas={masalas}
          onSelect={(spice) => {
            setSelectedSpice(spice);
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF8F4", fontFamily: "system-ui", color: "#4A4840", padding: 24, textAlign: "center" }}>
      <div>{children}</div>
    </div>
  );
}
