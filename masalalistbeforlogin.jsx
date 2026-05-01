import { useState } from "react";

const masalas = [
  { id: "chilli", name: "Chilli Powder", emoji: "🌶️", discount: 18, discountLabel: "18% OFF",
    sizes: ["100g", "200g", "500g", "1kg", "5kg"],
    prices: { "100g": 38, "200g": 72, "500g": 165, "1kg": 310, "5kg": 1380 },
    hsn: "09042211", cat: "Powder" },
  { id: "turmeric", name: "Turmeric Powder", emoji: "🟡", discount: 12, discountLabel: "12% OFF",
    sizes: ["100g", "200g", "500g", "1kg", "5kg"],
    prices: { "100g": 30, "200g": 55, "500g": 130, "1kg": 245, "5kg": 1100 },
    hsn: "09103030", cat: "Powder" },
  { id: "dhaniya", name: "Dhaniya Powder", emoji: "🌿", discount: 15, discountLabel: "15% OFF",
    sizes: ["100g", "200g", "500g", "1kg"],
    prices: { "100g": 28, "200g": 50, "500g": 115, "1kg": 215 },
    hsn: "09092200", cat: "Powder" },
  { id: "garam", name: "Garam Masala", emoji: "🫙", discount: 20, discountLabel: "20% OFF",
    sizes: ["100g", "200g", "500g", "1kg"],
    prices: { "100g": 55, "200g": 105, "500g": 245, "1kg": 460 },
    hsn: "09109100", cat: "Spice Blends" },
  { id: "chicken", name: "Chicken Masala", emoji: "🍗", discount: 10, discountLabel: "10% OFF",
    sizes: ["50g", "100g", "200g", "500g"],
    prices: { "50g": 32, "100g": 60, "200g": 115, "500g": 260 },
    hsn: "09109100", cat: "Spice Blends" },
  { id: "mutton", name: "Mutton Masala", emoji: "🥩", discount: 14, discountLabel: "14% OFF",
    sizes: ["50g", "100g", "200g", "500g"],
    prices: { "50g": 35, "100g": 65, "200g": 125, "500g": 285 },
    hsn: "09109100", cat: "Spice Blends" },
  { id: "biryani", name: "Biryani Pulav Masala", emoji: "🍚", discount: 22, discountLabel: "22% OFF",
    sizes: ["10g hanger", "50g", "100g", "500g"],
    prices: { "10g hanger": 12, "50g": 48, "100g": 90, "500g": 390 },
    hsn: "09109100", cat: "Spice Blends" },
  { id: "kasuri", name: "Kasuri Methi", emoji: "🍃", discount: 8, discountLabel: "8% OFF",
    sizes: ["10g", "50g", "100g", "200g"],
    prices: { "10g": 18, "50g": 72, "100g": 130, "200g": 240 },
    hsn: "09109924", cat: "Whole Spice" },
  { id: "kitchen", name: "Kitchen King Masala", emoji: "👑", discount: 16, discountLabel: "16% OFF",
    sizes: ["50g", "100g", "200g", "500g"],
    prices: { "50g": 40, "100g": 75, "200g": 140, "500g": 320 },
    hsn: "09109100", cat: "Spice Blends" },
  { id: "egg", name: "Egg Masala", emoji: "🥚", discount: 10, discountLabel: "10% OFF",
    sizes: ["15g", "50g", "100g", "200g"],
    prices: { "15g": 18, "50g": 48, "100g": 88, "200g": 165 },
    hsn: "09109100", cat: "Spice Blends" },
  { id: "blackpepper", name: "Black Pepper Powder", emoji: "⚫", discount: 18, discountLabel: "18% OFF",
    sizes: ["10g", "50g", "100g", "500g"],
    prices: { "10g": 22, "50g": 90, "100g": 170, "500g": 750 },
    hsn: "09109100", cat: "Powder" },
  { id: "ggp", name: "Ginger Garlic Paste", emoji: "🧄", discount: 12, discountLabel: "12% OFF",
    sizes: ["100g (2+1)", "200g (2+1)", "500g", "1kg"],
    prices: { "100g (2+1)": 42, "200g (2+1)": 78, "500g": 155, "1kg": 290 },
    hsn: "21039010", cat: "Paste" },
];

const categories = ["All", "Powder", "Spice Blends", "Paste", "Whole Spice"];

function MasalaCard({ item, onAdd }) {
  const [size, setSize] = useState(item.sizes[1] || item.sizes[0]);
  const [qty, setQty] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);
  const [added, setAdded] = useState(false);

  const price = item.prices[size];
  const mrp = Math.round(price / (1 - item.discount / 100));
  const savings = mrp - price;

  function handleAdd() {
    onAdd(price * qty, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div style={{
      background: "#fff", borderRadius: 14, overflow: "hidden",
      border: "1px solid #EDE8E0", display: "flex", flexDirection: "column",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image area */}
      <div style={{ position: "relative", background: "#FDF5EE", padding: "26px 16px 18px", textAlign: "center" }}>
        <div style={{
          position: "absolute", top: 0, left: 0,
          background: "#C0392B", color: "#fff",
          fontSize: 10, fontWeight: 800, padding: "5px 10px",
          borderRadius: "0 0 8px 0", letterSpacing: "0.05em",
        }}>{item.discountLabel}</div>
        <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 8 }}>{item.emoji}</div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 11, color: "#C0392B", fontWeight: 700,
          background: "#FEF0EE", padding: "3px 10px", borderRadius: 999,
        }}>⚡ 10 MINS</div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 14px 0", flex: 1 }}>
        <div style={{ fontSize: 11, color: "#8A8880", marginBottom: 3, letterSpacing: "0.04em" }}>RALA</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A16", marginBottom: 10, lineHeight: 1.3, minHeight: 38 }}>
          {item.name}
        </div>

        {/* Pack size */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: "#8A8880", display: "block", marginBottom: 4 }}>Pack size</label>
          <select
            value={size}
            onChange={e => setSize(e.target.value)}
            style={{
              width: "100%", padding: "8px 10px", borderRadius: 8,
              border: "1px solid #DDD8D0", fontSize: 13, color: "#1A1A16",
              background: "#FAFAF8", cursor: "pointer", fontFamily: "system-ui",
            }}
          >
            {item.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Price visible */}
        <div style={{
          background: "#F0FAF5", border: "1px solid #A3DFC0", borderRadius: 8,
          padding: "9px 12px", marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#0F5030" }}>₹{price}</span>
            <span style={{ fontSize: 12, color: "#8A8880", textDecoration: "line-through" }}>₹{mrp}</span>
            <span style={{
              fontSize: 11, color: "#C0392B", fontWeight: 700,
              background: "#FEF0EE", padding: "2px 6px", borderRadius: 6,
            }}>{item.discountLabel}</span>
          </div>
          <div style={{ fontSize: 11, color: "#1D7A4A", marginTop: 3 }}>
            + GST applicable · HSN: {item.hsn}
          </div>
        </div>

        {/* Savings line */}
        <div style={{ fontSize: 11, color: "#1D7A4A", marginBottom: 10, fontWeight: 600 }}>
          💰 You save ₹{savings} on this pack
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ padding: "0 14px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => setBookmarked(b => !b)}
          style={{
            width: 38, height: 38, borderRadius: 8,
            border: `1px solid ${bookmarked ? "#C0392B" : "#DDD8D0"}`,
            background: bookmarked ? "#FEF0EE" : "#fff",
            fontSize: 15, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >{bookmarked ? "🔖" : "🏷️"}</button>

        {/* Qty */}
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid #DDD8D0", borderRadius: 8, overflow: "hidden", flexShrink: 0,
        }}>
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            style={{ width: 30, height: 38, border: "none", background: "#F7F2EC", fontSize: 18, cursor: "pointer", color: "#C0392B", fontWeight: 700, lineHeight: 1 }}
          >−</button>
          <span style={{ width: 30, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#1A1A16" }}>{qty}</span>
          <button
            onClick={() => setQty(q => q + 1)}
            style={{ width: 30, height: 38, border: "none", background: "#F7F2EC", fontSize: 18, cursor: "pointer", color: "#C0392B", fontWeight: 700, lineHeight: 1 }}
          >+</button>
        </div>

        {/* Add */}
        <button
          onClick={handleAdd}
          style={{
            flex: 1, height: 38, borderRadius: 8,
            border: `1.5px solid ${added ? "#1D7A4A" : "#C0392B"}`,
            background: added ? "#EAF8F0" : "#fff",
            color: added ? "#1D7A4A" : "#C0392B",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            fontFamily: "system-ui", letterSpacing: "0.02em", transition: "all 0.15s",
          }}
        >{added ? "✓ Added" : "Add"}</button>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState(0);

  function handleAdd(amount, qty) {
    setCartTotal(t => t + amount);
    setCartItems(c => c + qty);
  }

  const filtered = masalas
    .filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || m.cat === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const sza = a.sizes[1] || a.sizes[0];
      const szb = b.sizes[1] || b.sizes[0];
      if (sortBy === "price-asc") return a.prices[sza] - b.prices[szb];
      if (sortBy === "price-desc") return b.prices[szb] - a.prices[sza];
      if (sortBy === "discount") return b.discount - a.discount;
      return 0;
    });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "#F5F0EA" }}>
      <style>{`
        input:focus { outline: none; }
        select:focus { outline: none; }
      `}</style>

      {/* ── Navbar ── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #EDE8E0",
        padding: "10px 20px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}>
        {/* Logo */}
        <div style={{
          background: "#C0392B", borderRadius: 10, width: 42, height: 42,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 900, color: "#fff", flexShrink: 0,
        }}>R</div>

        {/* Brand */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, color: "#1A1A16", lineHeight: 1 }}>Rala Spices</div>
          <div style={{ fontSize: 10, color: "#8A8880", letterSpacing: "0.08em", textTransform: "uppercase" }}>Wholesale · Dharwad</div>
        </div>

        {/* Category */}
        <div style={{
          background: "#C0392B", color: "#fff", borderRadius: 8,
          padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 8,
        }}>
          Shop by Category ▾
        </div>

        {/* Search */}
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8A8880", fontSize: 15 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search spices..."
            style={{
              width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8,
              border: "1px solid #EDE8E0", background: "#F8F4EE", fontSize: 14,
              color: "#1A1A16", fontFamily: "system-ui", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Delivery */}
        <div style={{
          background: "#FEF0EE", border: "1px solid #F5C0B0", borderRadius: 8,
          padding: "7px 14px", textAlign: "center", flexShrink: 0,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#C0392B" }}>⚡ Delivery in 10 mins</div>
          <div style={{ fontSize: 10, color: "#A05020" }}>Select Location</div>
        </div>

        {/* User avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#C0392B",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff",
          }}>A</div>
          <div style={{ fontSize: 13, color: "#1A1A16", fontWeight: 600 }}>Akalwadi</div>
        </div>

        {/* Cart */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            border: "1.5px solid #C0392B", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, cursor: "pointer",
          }}>🛒</div>
          {cartItems > 0 && (
            <div style={{
              position: "absolute", top: -6, right: -6, background: "#C0392B", color: "#fff",
              borderRadius: 999, minWidth: 18, height: 18, fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
            }}>{cartItems}</div>
          )}
        </div>
      </div>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px 52px" }}>

        {/* Welcome banner */}
        <div style={{
          background: "#EAF8F0", border: "1px solid #A3DFC0", borderRadius: 12,
          padding: "13px 18px", marginBottom: 22,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{ fontSize: 13, color: "#0F5030", lineHeight: 1.6 }}>
              <strong>Welcome back, Akalwadi!</strong> You're viewing exclusive wholesale prices. All prices are per unit before GST.
            </span>
          </div>
          <div style={{ fontSize: 12, color: "#1D7A4A", fontWeight: 600, whiteSpace: "nowrap" }}>
            GST: 29AAGFA8230Q1ZX
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
          {[
            { label: "PRODUCTS", value: "12", sub: "Available SKUs", color: "#1A1A16" },
            { label: "AVG DISCOUNT", value: "14.6%", sub: "Off MRP", color: "#C0392B" },
            { label: "CART TOTAL", value: `₹${cartTotal.toLocaleString("en-IN")}`, sub: `${cartItems} item${cartItems !== 1 ? "s" : ""}`, color: "#1A1A16" },
            { label: "DELIVERY", value: "FREE", sub: "Orders above ₹500", color: "#1D7A4A" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", borderRadius: 10, border: "1px solid #EDE8E0", padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#8A8880", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#8A8880" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
          <div>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 700, color: "#1A1A16", margin: 0, marginBottom: 4 }}>
              Rala Spices Range
            </h1>
            <p style={{ fontSize: 13, color: "#8A8880", margin: 0 }}>
              {filtered.length} products · Akalwadi Associates · Dharwad
            </p>
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid #DDD8D0",
              background: "#fff", fontSize: 13, color: "#1A1A16", fontFamily: "system-ui",
            }}
          >
            <option value="default">Default order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "7px 18px", borderRadius: 999,
                border: activeCategory === cat ? "none" : "1px solid #DDD8D0",
                background: activeCategory === cat ? "#C0392B" : "#fff",
                color: activeCategory === cat ? "#fff" : "#4A4840",
                fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >{cat}</button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8880", fontSize: 15 }}>
            No spices found for "{search}"
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
            {filtered.map(item => (
              <MasalaCard key={item.id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 40, padding: "16px 20px", background: "#fff",
          borderRadius: 12, border: "1px solid #EDE8E0",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{ fontSize: 28 }}>🏪</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A16" }}>Akalwadi Associates</div>
            <div style={{ fontSize: 12, color: "#8A8880" }}>Hanchinmani Bldg, Old APMC Dharwad · GST: 29AAGFA8230Q1ZX · Ph: 9448133699</div>
            <div style={{ fontSize: 12, color: "#8A8880" }}>Bank: Punjab National Bank · A/C: 3961005500000047 · IFSC: PUNB0396100</div>
          </div>
        </div>
      </div>
    </div>
  );
}