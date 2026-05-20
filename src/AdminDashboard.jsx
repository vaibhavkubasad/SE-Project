import React, { useEffect, useState } from "react";
import { SiteNav } from "./App";

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

// ==========================================
// ANALYTICS TAB
// ==========================================
function AnalyticsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  async function fetchAnalytics() {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics/sales?period=${period}`);
      if (!res.ok) throw new Error("Failed");
      setData(await res.json());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAnalytics(); }, [period]);

  if (loading) return <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8880" }}>Loading Analytics...</div>;
  if (!data) return <div style={{ padding: 20, background: "#FFF3F0", color: "#C0392B", borderRadius: 12 }}>Failed to load analytics</div>;

  const maxCat = Math.max(...data.salesByCategory.map(c => c.revenue), 1);
  const maxBrand = Math.max(...(data.salesByBrand || []).map(b => b.revenue), 1);

  return (
    <div>
      {/* Period Filter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 14, color: "#6A6860" }}>
          Sales overview for <strong>{period === "week" ? "This Week" : period === "month" ? "This Month" : "All Time"}</strong>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "This Week", value: "week" },
            { label: "This Month", value: "month" },
            { label: "All Time", value: "all" }
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setPeriod(f.value)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: period === f.value ? "2px solid #1A1A16" : "1px solid #CCCAC5",
                background: period === f.value ? "#1A1A16" : "#fff",
                color: period === f.value ? "#fff" : "#4A4840",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Revenue", value: fmt(data.totalRevenue), icon: "💰", color: "#1D9E75", bg: "#F0FBF6" },
          { label: "Total Orders", value: data.totalOrders, icon: "📦", color: "#1D4F8F", bg: "#EEF4FB" },
          { label: "Avg Order Value", value: fmt(data.avgOrderValue), icon: "📊", color: "#C48A0A", bg: "#FFF9E8" },
          { label: "Delivered", value: data.deliveredOrders, icon: "✅", color: "#1D9E75", bg: "#F0FBF6" },
          { label: "Pending", value: data.pendingOrders, icon: "⏳", color: "#E67E22", bg: "#FFF5EB" },
          { label: "In Transit", value: data.assignedOrders, icon: "🚚", color: "#1D4F8F", bg: "#EEF4FB" }
        ].map(card => (
          <div key={card.label} style={{
            background: "#fff",
            border: "1.5px solid #EDEAE4",
            borderRadius: 16,
            padding: "22px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: card.bg,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
              }}>
                {card.icon}
              </div>
              <span style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color, letterSpacing: "-0.5px" }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Sales by Category */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 0 }}>
        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A1A16", marginBottom: 20, letterSpacing: "-0.3px" }}>📂 Sales by Category</h3>
          {data.salesByCategory.map(cat => (
            <div key={cat.name} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#4A4840" }}>
                  {cat.name === "Oil" ? "🛢️" : cat.name === "Masala" ? "🌶️" : "🧴"} {cat.name}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A16" }}>{fmt(cat.revenue)}</span>
              </div>
              <div style={{ height: 10, background: "#F4F2EE", borderRadius: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.max((cat.revenue / maxCat) * 100, 2)}%`,
                  background: cat.name === "Oil" ? "linear-gradient(90deg, #1D4F8F, #3B82F6)" : cat.name === "Masala" ? "linear-gradient(90deg, #C48A0A, #F59E0B)" : "linear-gradient(90deg, #1D9E75, #34D399)",
                  borderRadius: 6,
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          ))}
          {data.salesByCategory.every(c => c.revenue === 0) && (
            <div style={{ textAlign: "center", color: "#8A8880", fontSize: 13, padding: "20px 0" }}>No sales data for this period</div>
          )}
        </div>

        {/* Sales by Brand */}
        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1A1A16", marginBottom: 20, letterSpacing: "-0.3px" }}>🏷️ Top Brands / Products</h3>
          {(data.salesByBrand || []).length === 0 ? (
            <div style={{ textAlign: "center", color: "#8A8880", fontSize: 13, padding: "20px 0" }}>No brand data for this period</div>
          ) : (
            data.salesByBrand.map((brand, idx) => (
              <div key={brand.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#4A4840" }}>
                    <span style={{ 
                      display: "inline-block", width: 20, height: 20, borderRadius: 6, 
                      background: "#1A1A16", color: "#fff", fontSize: 10, fontWeight: 800,
                      textAlign: "center", lineHeight: "20px", marginRight: 8
                    }}>
                      {idx + 1}
                    </span>
                    {brand.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1D9E75" }}>{fmt(brand.revenue)}</span>
                </div>
                <div style={{ height: 8, background: "#F4F2EE", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.max((brand.revenue / maxBrand) * 100, 3)}%`,
                    background: "linear-gradient(90deg, #6366F1, #A78BFA)",
                    borderRadius: 4,
                    transition: "width 0.6s ease"
                  }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MANAGE STORE TAB
// ==========================================
function ManageStoreTab() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Add form
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  async function fetchStores() {
    try {
      setLoading(true);
      const res = await fetch("/api/wholesalers");
      if (!res.ok) throw new Error("Failed");
      setStores(await res.json());
    } catch {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStores(); }, []);

  async function handleAddStore(e) {
    e.preventDefault();
    if (!newName || !newPassword) return alert("Name and password are required");
    try {
      const res = await fetch("/api/wholesalers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, password: newPassword, phone: newPhone, address: newAddress })
      });
      if (!res.ok) throw new Error("Failed");
      setShowAddModal(false);
      setNewName(""); setNewPassword(""); setNewPhone(""); setNewAddress("");
      fetchStores();
    } catch (err) { alert(err.message); }
  }

  async function handleSaveEdit(id) {
    try {
      const res = await fetch(`/api/wholesalers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, phone: editPhone, address: editAddress })
      });
      if (!res.ok) throw new Error("Failed");
      setEditingId(null);
      fetchStores();
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete store "${name}"? This will remove the wholesaler from the database.`)) return;
    try {
      const res = await fetch(`/api/wholesalers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      fetchStores();
    } catch (err) { alert(err.message); }
  }

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #CCCAC5", borderRadius: 8, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#6A6860" }}>
          Total Wholesalers: <strong>{stores.length}</strong> registered stores
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "10px 18px", borderRadius: 10, border: "none",
            background: "#1D9E75", color: "#fff", fontWeight: 700, fontSize: 13,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(29, 158, 117, 0.2)"
          }}
        >
          ＋ Add New Store
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8880" }}>Loading Stores...</div>
      ) : stores.length === 0 ? (
        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, padding: "50px", textAlign: "center", color: "#8A8880" }}>
          No wholesalers registered yet. Click "Add New Store" to get started.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#FDFDFD", borderBottom: "1.5px solid #EDEAE4", color: "#8A8880" }}>
                <th style={{ padding: "16px 20px" }}>#</th>
                <th style={{ padding: "16px 20px" }}>Store Name</th>
                <th style={{ padding: "16px 20px" }}>Phone</th>
                <th style={{ padding: "16px 20px" }}>Address</th>
                <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, idx) => {
                const isEditing = editingId === store._id;
                return (
                  <tr key={store._id} style={{ borderBottom: "1px solid #EDEAE4" }}>
                    <td style={{ padding: "16px 20px", color: "#8A8880", fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: "16px 20px" }}>
                      {isEditing ? (
                        <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...inputStyle, width: 160 }} />
                      ) : (
                        <span style={{ fontWeight: 700, color: "#1A1A16" }}>{store.name}</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {isEditing ? (
                        <input value={editPhone} onChange={e => setEditPhone(e.target.value)} style={{ ...inputStyle, width: 130 }} placeholder="Phone number" />
                      ) : (
                        <span style={{ color: "#4A4840" }}>{store.phone || "—"}</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {isEditing ? (
                        <input value={editAddress} onChange={e => setEditAddress(e.target.value)} style={{ ...inputStyle, width: 180 }} placeholder="Address" />
                      ) : (
                        <span style={{ color: "#4A4840" }}>{store.address || "—"}</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button onClick={() => handleSaveEdit(store._id)} style={{ padding: "6px 14px", border: "none", background: "#1D9E75", color: "#fff", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Save</button>
                          <button onClick={() => setEditingId(null)} style={{ padding: "6px 14px", border: "1px solid #CCCAC5", background: "#fff", color: "#4A4840", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button
                            onClick={() => { setEditingId(store._id); setEditName(store.name); setEditPhone(store.phone || ""); setEditAddress(store.address || ""); }}
                            style={{ padding: "6px 14px", border: "1px solid #CCCAC5", background: "#fff", color: "#4A4840", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 12 }}
                          >Edit</button>
                          <button
                            onClick={() => handleDelete(store._id, store.name)}
                            style={{ padding: "6px 14px", border: "none", background: "#FFF3F0", color: "#C0392B", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 12 }}
                          >Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD STORE MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26, 26, 22, 0.4)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 100,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: "32px",
            width: "100%", maxWidth: 440, boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Add New Store</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8A8880" }}>✕</button>
            </div>
            <form onSubmit={handleAddStore}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Store / Wholesaler Name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} required style={inputStyle} placeholder="Enter wholesaler name" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Login Password *</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={inputStyle} placeholder="Password for login" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Phone Number</label>
                <input value={newPhone} onChange={e => setNewPhone(e.target.value)} style={inputStyle} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Address</label>
                <input value={newAddress} onChange={e => setNewAddress(e.target.value)} style={inputStyle} placeholder="Store address" />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "#1A1A16", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
              }}>
                Add Store to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// STAFF TAB
// ==========================================
function StaffTab() {
  const [staff, setStaff] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("Manager");

  async function fetchAll() {
    try {
      setLoading(true);
      const [staffRes, perfRes] = await Promise.all([
        fetch("/api/staff"),
        fetch("/api/staff/performance")
      ]);
      if (staffRes.ok) setStaff(await staffRes.json());
      if (perfRes.ok) setPerformance(await perfRes.json());
    } catch { } finally { setLoading(false); }
  }

  useEffect(() => { fetchAll(); }, []);

  async function handleAddStaff(e) {
    e.preventDefault();
    if (!newName || !newPassword) return alert("Name and password required");
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, password: newPassword, role: newRole })
      });
      if (!res.ok) throw new Error("Failed");
      setShowAddModal(false);
      setNewName(""); setNewPassword(""); setNewRole("Manager");
      fetchAll();
    } catch (err) { alert(err.message); }
  }

  async function handleRemove(member) {
    if (!window.confirm(`Remove ${member.role} "${member.name}" from staff?`)) return;
    try {
      const res = await fetch(`/api/staff/${member.role}/${member._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      fetchAll();
    } catch (err) { alert(err.message); }
  }

  function getPerf(name) {
    return performance.find(p => p.name === name);
  }

  const inputStyle = { width: "100%", padding: "10px 12px", border: "1px solid #CCCAC5", borderRadius: 8, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#6A6860" }}>
          Total Staff: <strong>{staff.length}</strong> members ({staff.filter(s => s.role === "Manager").length} Managers, {staff.filter(s => s.role === "Driver").length} Drivers)
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: "10px 18px", borderRadius: 10, border: "none",
            background: "#1D9E75", color: "#fff", fontWeight: 700, fontSize: 13,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(29, 158, 117, 0.2)"
          }}
        >
          ＋ Add New Staff
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8880" }}>Loading Staff...</div>
      ) : staff.length === 0 ? (
        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, padding: "50px", textAlign: "center", color: "#8A8880" }}>
          No staff members found.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#FDFDFD", borderBottom: "1.5px solid #EDEAE4", color: "#8A8880" }}>
                <th style={{ padding: "16px 20px" }}>#</th>
                <th style={{ padding: "16px 20px" }}>Name</th>
                <th style={{ padding: "16px 20px" }}>Role</th>
                <th style={{ padding: "16px 20px" }}>Performance</th>
                <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member, idx) => {
                const perf = getPerf(member.name);
                return (
                  <tr key={member._id} style={{ borderBottom: "1px solid #EDEAE4" }}>
                    <td style={{ padding: "16px 20px", color: "#8A8880", fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: "16px 20px", fontWeight: 700, color: "#1A1A16" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: member.role === "Manager" ? "linear-gradient(135deg, #6366F1, #A78BFA)" : "linear-gradient(135deg, #1D9E75, #34D399)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 14, fontWeight: 800
                        }}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        {member.name}
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        background: member.role === "Manager" ? "#EDE9FE" : "#F0FBF6",
                        color: member.role === "Manager" ? "#6366F1" : "#1D9E75",
                        padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700
                      }}>
                        {member.role === "Manager" ? "👔" : "🚚"} {member.role}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      {member.role === "Driver" && perf ? (
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#1D9E75" }}>{perf.totalDelivered}</div>
                            <div style={{ fontSize: 10, color: "#8A8880", textTransform: "uppercase" }}>Delivered</div>
                          </div>
                          <div style={{ width: 1, height: 28, background: "#EDEAE4" }} />
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#1D4F8F" }}>{perf.totalAssigned}</div>
                            <div style={{ fontSize: 10, color: "#8A8880", textTransform: "uppercase" }}>Assigned</div>
                          </div>
                          <div style={{ width: 1, height: 28, background: "#EDEAE4" }} />
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#E67E22" }}>{perf.pendingDeliveries}</div>
                            <div style={{ fontSize: 10, color: "#8A8880", textTransform: "uppercase" }}>Pending</div>
                          </div>
                        </div>
                      ) : member.role === "Manager" ? (
                        <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 600 }}>✨ Active</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#8A8880" }}>No data</span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <button
                        onClick={() => handleRemove(member)}
                        style={{
                          padding: "6px 14px", border: "none", background: "#FFF3F0",
                          color: "#C0392B", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: 12
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26, 26, 22, 0.4)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 100,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff", borderRadius: 18, padding: "32px",
            width: "100%", maxWidth: 440, boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Add New Staff Member</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8A8880" }}>✕</button>
            </div>
            <form onSubmit={handleAddStaff}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 8 }}>Select Role</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Manager", "Driver"].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setNewRole(r)}
                      style={{
                        flex: 1, padding: "12px", borderRadius: 10,
                        border: newRole === r ? "2px solid #1A1A16" : "1px solid #CCCAC5",
                        background: newRole === r ? (r === "Manager" ? "#EDE9FE" : "#F0FBF6") : "#fff",
                        color: "#1A1A16", fontWeight: 700, fontSize: 13, cursor: "pointer"
                      }}
                    >
                      {r === "Manager" ? "👔" : "🚚"} {r}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Full Name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} required style={inputStyle} placeholder="Enter staff name" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Login Password *</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={inputStyle} placeholder="Password for login" />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "#1A1A16", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer"
              }}>
                Add {newRole} to Staff
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN ADMIN DASHBOARD
// ==========================================
export default function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("analytics");

  const adminSession = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const adminName = adminSession.name || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    onNavigate("/");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Admin Panel", href: "/admin" },
    { label: "Logout", href: "/logout-action" }
  ];

  const tabs = [
    { key: "analytics", label: "📊 Analytics", icon: "📊" },
    { key: "stores", label: "🏪 Manage Store", icon: "🏪" },
    { key: "staff", label: "👥 Staff", icon: "👥" }
  ];

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      <SiteNav
        items={navItems}
        currentPath="/admin"
        onNavigate={(path) => {
          if (path === "/logout-action") {
            handleLogout();
          } else {
            onNavigate(path);
          }
        }}
      />

      <div style={{ padding: "40px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Dashboard Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Admin Control Center</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A16", marginTop: 4, letterSpacing: "-0.5px" }}>Welcome, {adminName}</h1>
            <p style={{ color: "#6A6860", fontSize: 14, marginTop: 4 }}>Full access to analytics, store management & staff operations</p>
          </div>
          <button
            onClick={() => onNavigate("/logout")}
            style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #EDEAE4", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#4A4840" }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #EDEAE4", gap: 8, marginBottom: 28 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "14px 20px",
                border: "none",
                background: activeTab === tab.key ? "#1A1A16" : "none",
                fontSize: 14,
                fontWeight: 700,
                color: activeTab === tab.key ? "#fff" : "#8A8880",
                borderRadius: activeTab === tab.key ? "10px 10px 0 0" : "10px 10px 0 0",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "stores" && <ManageStoreTab />}
        {activeTab === "staff" && <StaffTab />}
      </div>
    </div>
  );
}
