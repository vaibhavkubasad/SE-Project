import React, { useEffect, useState } from "react";
import { SiteNav } from "./App";

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

export default function OrdersPage({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const wholesalerName = user.name || "Guest Wholesaler";

  useEffect(() => {
    let cancelled = false;
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/orders?wholesalerName=${encodeURIComponent(wholesalerName)}`);
        if (!response.ok) throw new Error("Failed to load orders");
        const data = await response.json();
        if (!cancelled) {
          setOrders(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load orders");
          setLoading(false);
        }
      }
    }
    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [wholesalerName]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "#products", dropdown: [
      { label: "Spices", href: "/spices" },
      { label: "Edible Oil", href: "/oil" }
    ]},
    { label: "Orders", href: "/orders" },
    { label: "Logout", href: "/logout-action" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    onNavigate("/");
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      <SiteNav 
        items={navItems} 
        currentPath="/orders" 
        onNavigate={(path) => {
          if (path === "/logout-action") {
            handleLogout();
          } else {
            onNavigate(path);
          }
        }} 
      />

      <div style={{ padding: "40px 24px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Wholesaler Portal</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A16", marginTop: 4, letterSpacing: "-0.5px" }}>Your Previous Orders</h1>
            <p style={{ color: "#6A6860", fontSize: 14, marginTop: 4 }}>Logged in as: <strong style={{ color: "#1A1A16" }}>{wholesalerName}</strong></p>
          </div>
          <button 
            onClick={() => onNavigate("/logout")}
            style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #EDEAE4", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#4A4840", transition: "all 0.2s" }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8A8880" }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>⏳</div>
            Loading your orders...
          </div>
        ) : error ? (
          <div style={{ background: "#FFF3F0", border: "1px solid #F4C1B8", borderRadius: 14, padding: "20px", color: "#C0392B", textAlign: "center" }}>
            <h3>Error loading orders</h3>
            <p>{error}</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>Please ensure the API server is running.</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 18, padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontSize: 18, color: "#1A1A16", margin: "0 0 8px" }}>No orders placed yet</h3>
            <p style={{ color: "#6A6860", fontSize: 14, maxWidth: 400, margin: "0 auto 24px" }}>
              Explore our catalogs and add premium edible oils and spices to your cart to place your first wholesale order.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => onNavigate("/oil")} style={{ padding: "12px 20px", borderRadius: 10, border: "none", background: "#1A1A16", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                Browse Oils
              </button>
              <button onClick={() => onNavigate("/spices")} style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid #EDEAE4", background: "#fff", color: "#4A4840", fontWeight: 600, cursor: "pointer" }}>
                Browse Spices
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {orders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              });

              // Status styles
              let badgeBg = "#FFF9E8";
              let badgeColor = "#D49B15";
              let badgeBorder = "#F0DA8F";
              let statusLabel = "⏳ Pending Confirmation";

              if (order.status === "Assigned") {
                badgeBg = "#EEF4FB";
                badgeColor = "#1D4F8F";
                badgeBorder = "#C9DBEF";
                statusLabel = `🚚 Dispatched: ${order.driverName || "Driver Assigned"}`;
              } else if (order.status === "Delivered") {
                badgeBg = "#F0FBF6";
                badgeColor = "#1D9E75";
                badgeBorder = "#A0DFC5";
                statusLabel = `✅ Delivered ${order.driverName ? `by ${order.driverName}` : ""}`;
              }

              return (
                <div 
                  key={order._id}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #EDEAE4",
                    borderRadius: 18,
                    padding: "24px",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.02)",
                    transition: "transform 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, borderBottom: "1px solid #F4F2EE", paddingBottom: "16px", marginBottom: "16px" }}>
                    <div>
                      <span style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", fontWeight: 700 }}>Order ID: {order._id.substring(18)}</span>
                      <div style={{ fontSize: 13, color: "#6A6860", marginTop: 4 }}>Placed on {dateStr}</div>
                    </div>
                    <div 
                      style={{
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                        borderRadius: 30,
                        padding: "6px 14px",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "-0.1px"
                      }}
                    >
                      {statusLabel}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Items Detail</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                          <span style={{ color: "#4A4840" }}>
                            {item.oilName ? (
                              <strong>{item.brand} {item.oilName}</strong>
                            ) : (
                              <strong>{item.name} Spice</strong>
                            )}
                            {" — "}{item.qty} × {item.pack}
                          </span>
                          <span style={{ fontWeight: 600, color: "#1A1A16" }}>{fmt(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "14px", borderTop: "1.5px dashed #EDEAE4" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#4A4840" }}>Grand Total</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#1D9E75" }}>{fmt(order.totalAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
