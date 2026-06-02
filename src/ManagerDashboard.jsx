import React, { useEffect, useState } from "react";
import { SiteNav } from "./App";
import { getOilTypeImage } from "../oilTypeImages";
import { getMasalaImage } from "../masalaImages";

function fmt(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function getThumbnail(item) {
  if (item.type === "Oil") {
    return item.image || getOilTypeImage(item.oilType, "/oils_category.jpg");
  }
  return item.image || getMasalaImage(item.name);
}

function getOrderItemThumbnail(item) {
  if (item.image) return item.image;
  if (item.oilName) return getOilTypeImage(item.oilName, "/oils_category.jpg");
  return getMasalaImage(item.name);
}

function handleThumbnailError(event, fallback) {
  if (!event.currentTarget.src.endsWith(fallback)) {
    event.currentTarget.src = fallback;
  }
}

const MAX_IMAGE_SIZE_MB = 4;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export default function ManagerDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("inventory"); // 'inventory' or 'orders'
  
  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [invLoading, setInvLoading] = useState(true);
  const [invError, setInvError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");

  // Low Stock States
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [lowStockAlerted, setLowStockAlerted] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);

  // Add Product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState("Oil");
  const [newBrand, setNewBrand] = useState(""); // For Oil companyName
  const [newOilType, setNewOilType] = useState(""); // For Oil oilType
  const [newName, setNewName] = useState(""); // For Masala name
  const [newPack, setNewPack] = useState(""); // quantity or weight
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("100");
  const [newImage, setNewImage] = useState(""); // Base64 image uploaded from device
  const [newImageError, setNewImageError] = useState("");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState({}); // orderId -> driverName

  const managerSession = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const managerName = managerSession.name || "Manager";

  // Fetch Inventory
  async function fetchInventory() {
    try {
      setInvLoading(true);
      const response = await fetch("/api/inventory");
      if (!response.ok) throw new Error("Failed to load inventory");
      const data = await response.json();
      setInventory(data);
      setInvError("");

      // Identify low stock items (stock <= 10)
      const lowStock = data.filter(item => Number(item.stock) <= 10);
      setLowStockItems(lowStock);
      if (lowStock.length > 0 && !lowStockAlerted) {
        setShowLowStockModal(true);
        setLowStockAlerted(true);
      }
    } catch (err) {
      setInvError(err.message || "Failed to load inventory");
    } finally {
      setInvLoading(false);
    }
  }

  // Fetch Orders & Drivers
  async function fetchOrdersAndDrivers() {
    try {
      setOrdersLoading(true);
      const [ordersRes, driversRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/drivers")
      ]);

      if (!ordersRes.ok) throw new Error("Failed to load orders");
      if (!driversRes.ok) throw new Error("Failed to load drivers");

      const ordersData = await ordersRes.json();
      const driversData = await driversRes.json();

      setOrders(ordersData);
      setDrivers(driversData);
      setOrdersError("");
    } catch (err) {
      setOrdersError(err.message || "Failed to load orders or drivers");
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchInventory();
    } else {
      fetchOrdersAndDrivers();
    }
  }, [activeTab]);

  // Handle Edit Inline Save
  async function handleSaveEdit(item) {
    if (!editPrice || !editStock) return;
    try {
      const response = await fetch(`/api/inventory/${item.type}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number(editPrice),
          stock: Number(editStock)
        })
      });
      if (!response.ok) throw new Error("Failed to update item");
      
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      alert(err.message);
    }
  }

  // Handle Delete Product
  async function handleDelete(item) {
    if (!window.confirm(`Are you sure you want to delete ${item.name}?`)) return;
    try {
      const response = await fetch(`/api/inventory/${item.type}/${item._id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete item");
      fetchInventory();
    } catch (err) {
      alert(err.message);
    }
  }

  // Handle Add Product Submit
  async function handleAddProduct(e) {
    e.preventDefault();
    if (!newPrice) return;

    let payload = {
      price: Number(newPrice),
      stock: Number(newStock)
    };

    if (newType === "Oil") {
      if (!newBrand || !newOilType || !newPack) {
        alert("Please enter Brand, Oil Type, and Pack Size");
        return;
      }
      payload.companyName = newBrand;
      payload.oilType = newOilType;
      payload.quantity = newPack;
    } else if (newType === "Masala") {
      if (!newName || !newPack) {
        alert("Please enter Name and Pack Size");
        return;
      }
      payload.name = newName;
      payload.weight = newPack;
    } else {
      if (!newName || !newPack) {
        alert("Please enter Name and Quantity");
        return;
      }
      payload.name = newName;
      payload.quantity = newPack;
    }

    if (newImage) payload.image = newImage;

    try {
      const response = await fetch(`/api/inventory/${newType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to add product");
      
      setShowAddModal(false);
      // Reset form
      setNewBrand("");
      setNewOilType("");
      setNewName("");
      setNewPack("");
      setNewPrice("");
      setNewStock("100");
      setNewImage("");
      setNewImageError("");
      fetchInventory();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleProductImageFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNewImageError("Please choose a valid image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setNewImageError(`Please choose an image smaller than ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setNewImage(String(ev.target.result || ""));
      setNewImageError("");
    };
    reader.onerror = () => setNewImageError("Could not read this image. Please try another file.");
    reader.readAsDataURL(file);
  }

  // Handle Driver Assignment
  async function handleAssignDriver(orderId) {
    const driverName = selectedDrivers[orderId];
    if (!driverName) {
      alert("Please select a driver first");
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverName })
      });
      if (!response.ok) throw new Error("Failed to assign driver");
      fetchOrdersAndDrivers();
    } catch (err) {
      alert(err.message);
    }
  }

  // Handle Order Status Update (Mark Delivered)
  async function handleMarkDelivered(orderId) {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Delivered" })
      });
      if (!response.ok) throw new Error("Failed to update status");
      fetchOrdersAndDrivers();
    } catch (err) {
      alert(err.message);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    onNavigate("/");
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Manager Portal", href: "/manager" },
    { label: "Logout", href: "/logout-action" }
  ];

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "#FAFAF8" }}>
      <SiteNav 
        items={navItems} 
        currentPath="/manager" 
        onNavigate={(path) => {
          if (path === "/logout-action") {
            handleLogout();
          } else {
            onNavigate(path);
          }
        }} 
      />

      <div style={{ padding: "40px 24px 60px", maxWidth: 1000, margin: "0 auto" }}>
        {/* Dashboard Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "#8A8880", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>Management Dashboard</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1A1A16", marginTop: 4, letterSpacing: "-0.5px" }}>Welcome Back, {managerName}</h1>
            <p style={{ color: "#6A6860", fontSize: 14, marginTop: 4 }}>Control Panel for Stock Inventory and Order Dispatches</p>
          </div>
          <button 
            onClick={() => onNavigate("/logout")}
            style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #EDEAE4", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#4A4840" }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* LOW STOCK WARNING BANNER */}
        {lowStockItems.length > 0 && (
          <div style={{
            background: "linear-gradient(135deg, #FFF9F2 0%, #FFF3E0 100%)",
            border: "1.5px solid #FFD180",
            borderRadius: 16,
            padding: "16px 24px",
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 6px 20px rgba(255, 171, 0, 0.08)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <div>
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#E65100" }}>Critical Low Stock Warning</h4>
                <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#E65100", opacity: 0.85 }}>
                  The following items have less than 10% stock remaining: <strong>{lowStockItems.map(item => item.name).join(", ")}</strong>. Please restock immediately!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLowStockModal(true)}
              style={{
                padding: "8px 16px",
                background: "#E65100",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(230, 81, 0, 0.2)",
                transition: "all 0.15s",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => e.target.style.background = "#BF360C"}
              onMouseLeave={(e) => e.target.style.background = "#E65100"}
            >
              Details &rarr;
            </button>
          </div>
        )}

        {/* Dynamic Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #EDEAE4", gap: 24, marginBottom: 28 }}>
          <button
            onClick={() => setActiveTab("inventory")}
            style={{
              padding: "12px 6px",
              border: "none",
              background: "none",
              fontSize: 15,
              fontWeight: 700,
              color: activeTab === "inventory" ? "#1A1A16" : "#8A8880",
              borderBottom: activeTab === "inventory" ? "3px solid #1A1A16" : "3px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            📦 Inventory Manager
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "12px 6px",
              border: "none",
              background: "none",
              fontSize: 15,
              fontWeight: 700,
              color: activeTab === "orders" ? "#1A1A16" : "#8A8880",
              borderBottom: activeTab === "orders" ? "3px solid #1A1A16" : "3px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s"
            }}
          >
            🚚 Wholesaler Orders
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGER */}
        {activeTab === "inventory" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 14, color: "#6A6860" }}>
                Total Products: <strong>{inventory.length}</strong> items in stock catalog.
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "#1D9E75",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(29, 158, 117, 0.2)"
                }}
              >
                ＋ Add New Product
              </button>
            </div>

            {invLoading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8880" }}>Loading Stock Inventory...</div>
            ) : invError ? (
              <div style={{ padding: 20, background: "#FFF3F0", color: "#C0392B", borderRadius: 12 }}>{invError}</div>
            ) : (
              <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#FDFDFD", borderBottom: "1.5px solid #EDEAE4", color: "#8A8880" }}>
                      <th style={{ padding: "16px 20px" }}>Thumbnail</th>
                      <th style={{ padding: "16px 20px" }}>Item Type</th>
                      <th style={{ padding: "16px 20px" }}>Product Name</th>
                      <th style={{ padding: "16px 20px" }}>Pack Size</th>
                      <th style={{ padding: "16px 20px" }}>Unit Price</th>
                      <th style={{ padding: "16px 20px" }}>Stock Available</th>
                      <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const isEditing = editingId === item._id;
                      return (
                        <tr key={item._id} style={{ borderBottom: "1px solid #EDEAE4", transition: "background 0.15s" }}>
                          <td style={{ padding: "16px 20px" }}>
                            <img
                              src={getThumbnail(item)}
                              alt={item.name}
                              onError={(event) => handleThumbnailError(event, item.type === "Oil" ? "/oils_category.jpg" : "/spices_category.jpg")}
                              style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", border: "1px solid #EDEAE4" }}
                            />
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{
                              background: item.type === "Oil" ? "#EEF4FB" : item.type === "Masala" ? "#FFF9E8" : "#F0FBF6",
                              color: item.type === "Oil" ? "#1D4F8F" : item.type === "Masala" ? "#C48A0A" : "#1D9E75",
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700
                            }}>
                              {item.type}
                            </span>
                          </td>
                          <td style={{ padding: "16px 20px", fontWeight: 600, color: "#1A1A16" }}>{item.name}</td>
                          <td style={{ padding: "16px 20px", color: "#4A4840" }}>{item.pack}</td>
                          <td style={{ padding: "16px 20px" }}>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                style={{ width: 80, padding: "6px", border: "1px solid #CCCAC5", borderRadius: 6 }}
                              />
                            ) : (
                              <strong>{fmt(item.price)}</strong>
                            )}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                style={{ width: 80, padding: "6px", border: "1px solid #CCCAC5", borderRadius: 6 }}
                              />
                            ) : (
                              <span style={{ 
                                color: item.stock <= 10 ? "#C0392B" : "#1A1A16", 
                                fontWeight: item.stock <= 10 ? 700 : 500 
                              }}>
                                {item.stock} Units {item.stock <= 10 && "⚠️ Low Stock!"}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "16px 20px", textAlign: "right" }}>
                            {isEditing ? (
                              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => handleSaveEdit(item)}
                                  style={{ padding: "6px 12px", border: "none", background: "#1D9E75", color: "#fff", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  style={{ padding: "6px 12px", border: "1px solid #CCCAC5", background: "#fff", color: "#4A4840", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => {
                                    setEditingId(item._id);
                                    setEditPrice(String(item.price));
                                    setEditStock(String(item.stock));
                                  }}
                                  style={{ padding: "6px 12px", border: "1px solid #CCCAC5", background: "#fff", color: "#4A4840", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item)}
                                  style={{ padding: "6px 12px", border: "none", background: "#FFF3F0", color: "#C0392B", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
                                >
                                  Delete
                                </button>
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
          </div>
        )}

        {/* TAB 2: WHOLESALER ORDERS */}
        {activeTab === "orders" && (
          <div>
            <div style={{ fontSize: 14, color: "#6A6860", marginBottom: 20 }}>
              Viewing all wholesaler requests. Total Orders: <strong>{orders.length}</strong>
            </div>

            {ordersLoading ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8880" }}>Loading Wholesale Orders...</div>
            ) : ordersError ? (
              <div style={{ padding: 20, background: "#FFF3F0", color: "#C0392B", borderRadius: 12 }}>{ordersError}</div>
            ) : orders.length === 0 ? (
              <div style={{ background: "#fff", border: "1.5px solid #EDEAE4", borderRadius: 16, padding: "50px", textAlign: "center", color: "#8A8880" }}>
                No orders are currently recorded in the system.
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

                  return (
                    <div
                      key={order._id}
                      style={{
                        background: "#fff",
                        border: "1.5px solid #EDEAE4",
                        borderRadius: 16,
                        padding: "24px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.01)"
                      }}
                    >
                      {/* Order info row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #F4F2EE", paddingBottom: 16, marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1A1A16" }}>{order.wholesalerName}</h3>
                            <span style={{
                              background: order.status === "Pending" ? "#FFF9E8" : order.status === "Assigned" ? "#EEF4FB" : "#F0FBF6",
                              color: order.status === "Pending" ? "#C48A0A" : order.status === "Assigned" ? "#1D4F8F" : "#1D9E75",
                              padding: "3px 10px",
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700
                            }}>
                              {order.status}
                            </span>
                          </div>
                          <span style={{ fontSize: 11, color: "#8A8880", display: "block", marginTop: 4 }}>ID: {order._id.substring(18)} · {dateStr}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", display: "block" }}>Order Amount</span>
                          <span style={{ fontSize: 18, fontWeight: 800, color: "#1D9E75" }}>{fmt(order.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Ordered Items</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {order.items.map((item, idx) => {
                            const fallback = item.oilName ? "/oils_category.jpg" : "/spices_category.jpg";
                            return (
                            <span
                              key={idx}
                              style={{
                                background: "#FAFAF8",
                                border: "1px solid #EDEAE4",
                                borderRadius: 8,
                                padding: "6px 12px 6px 6px",
                                fontSize: 12,
                                color: "#4A4840",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8
                              }}
                            >
                              <img
                                src={getOrderItemThumbnail(item)}
                                alt={item.oilName ? `${item.brand} ${item.oilName}` : item.name}
                                onError={(event) => handleThumbnailError(event, fallback)}
                                style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover", border: "1px solid #EDEAE4" }}
                              />
                              {item.oilName ? `${item.brand} ${item.oilName}` : item.name} ({item.qty} × {item.pack})
                            </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Allocation actions row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1.5px dashed #EDEAE4", paddingTop: 16, flexWrap: "wrap", gap: 16 }}>
                        <div>
                          {order.driverName ? (
                            <div style={{ fontSize: 13, color: "#4A4840" }}>
                              🚚 Active Driver: <strong style={{ color: "#1A1A16" }}>{order.driverName}</strong>
                            </div>
                          ) : (
                            <div style={{ fontSize: 13, color: "#8A8880" }}>
                              ⚠️ No driver assigned yet
                            </div>
                          )}
                        </div>

                        <div>
                          {order.status === "Pending" && (
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <select
                                value={selectedDrivers[order._id] || ""}
                                onChange={(e) => setSelectedDrivers({ ...selectedDrivers, [order._id]: e.target.value })}
                                style={{
                                  padding: "8px 12px",
                                  borderRadius: 8,
                                  border: "1px solid #CCCAC5",
                                  fontSize: 13,
                                  background: "#fff",
                                  color: "#1A1A16",
                                  fontWeight: 500
                                }}
                              >
                                <option value="">-- Choose Driver --</option>
                                {drivers.map((drv, i) => (
                                  <option key={i} value={drv.name}>{drv.name}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleAssignDriver(order._id)}
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: 8,
                                  border: "none",
                                  background: "#1D4F8F",
                                  color: "#fff",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  cursor: "pointer"
                                }}
                              >
                                Assign Driver
                              </button>
                            </div>
                          )}

                          {order.status === "Assigned" && (
                            <button
                              onClick={() => handleMarkDelivered(order._id)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "none",
                                background: "#1D9E75",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              ✓ Mark as Delivered
                            </button>
                          )}

                          {order.status === "Delivered" && (
                            <span style={{ fontSize: 13, color: "#1D9E75", fontWeight: 700 }}>
                              🎉 Order Completed Successfully
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(26, 26, 22, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 18,
            padding: "32px",
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.3px" }}>Add Product to Stock</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8A8880" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              {/* Product Type Select */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: "#8A8880", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 6 }}>Catalog Category</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Oil", "Masala"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        border: newType === t ? "2px solid #1A1A16" : "1px solid #CCCAC5",
                        background: newType === t ? "#EEF4FB" : "#fff",
                        color: "#1A1A16",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic inputs based on Type */}
              {newType === "Oil" ? (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Brand Name (e.g. Freedom)</label>
                    <input
                      type="text"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      placeholder="Freedom, Gemini, Fortune"
                      required
                      style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Oil Type (e.g. Sunflower)</label>
                    <input
                      type="text"
                      value={newOilType}
                      onChange={(e) => setNewOilType(e.target.value)}
                      placeholder="Sunflower, Coconut, Mustard"
                      required
                      style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Pack Volume (e.g. 1L, 5L, 500ml)</label>
                    <input
                      type="text"
                      value={newPack}
                      onChange={(e) => setNewPack(e.target.value)}
                      placeholder="1L"
                      required
                      style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Product Name (e.g. Turmeric Powder)</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Sambhar Powder, Turmeric, Bath Soap"
                      required
                      style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Pack Size (e.g. 250g, 500g, 1 Pack)</label>
                    <input
                      type="text"
                      value={newPack}
                      onChange={(e) => setNewPack(e.target.value)}
                      placeholder="500g"
                      required
                      style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Unit Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Price in ₹"
                    required
                    style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    placeholder="100"
                    required
                    style={{ width: "100%", padding: "10px", border: "1px solid #CCCAC5", borderRadius: 8, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Product Image Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>Product Image (optional)</label>
                <div style={{
                  border: "2px dashed #CCCAC5",
                  borderRadius: 10,
                  padding: "16px",
                  textAlign: "center",
                  background: "#FAFAF8",
                  cursor: "pointer",
                  transition: "border-color 0.2s"
                }}
                  onClick={() => document.getElementById("product-image-upload")?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleProductImageFile(e.dataTransfer.files[0]);
                  }}
                >
                  {newImage ? (
                    <div style={{ position: "relative" }}>
                      <img
                        src={newImage}
                        alt="Preview"
                        style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8 }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewImage("");
                        }}
                        style={{
                          position: "absolute", top: 6, right: 6,
                          background: "rgba(26,26,22,0.75)", color: "#fff",
                          border: "none", borderRadius: "50%", width: 26, height: 26,
                          cursor: "pointer", fontSize: 14, display: "flex",
                          alignItems: "center", justifyContent: "center"
                        }}
                      >✕</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                      <div style={{ fontSize: 13, color: "#6A6860", marginBottom: 8 }}>
                        Drag &amp; drop or click to upload
                      </div>
                      <label
                        htmlFor="product-image-upload"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-block",
                          padding: "8px 18px",
                          background: "#1A1A16",
                          color: "#fff",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Choose Image
                      </label>
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          handleProductImageFile(e.target.files[0]);
                          e.target.value = "";
                        }}
                      />
                      <div style={{ fontSize: 11, color: "#A0A09A", marginTop: 6 }}>JPG, PNG, WEBP up to {MAX_IMAGE_SIZE_MB}MB</div>
                    </div>
                  )}
                </div>
                {newImageError && (
                  <div style={{ marginTop: 8, fontSize: 12, color: "#C0392B", fontWeight: 600 }}>{newImageError}</div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: 10,
                  border: "none",
                  background: "#1A1A16",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Add Product to Catalogue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOW STOCK PREMIUM GLASSMORPHIC OVERLAY MODAL */}
      {showLowStockModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(26, 26, 22, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 200,
          backdropFilter: "blur(12px)"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.85)",
            border: "1.5px solid rgba(255, 171, 0, 0.3)",
            borderRadius: 24,
            padding: "36px",
            width: "100%",
            maxWidth: 520,
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(20px)",
            textAlign: "center"
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFB300, #FF6F00)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(255, 111, 0, 0.3)",
              fontSize: 32
            }}>
              ⚠️
            </div>
            
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#E65100", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
              Restock Warning
            </h2>
            <p style={{ color: "#6A6860", fontSize: 14, margin: "0 0 24px 0", lineHeight: 1.6 }}>
              Our inventory tracking shows some core essential items have fallen below the <strong>10% threshold</strong> value (10 units or less).
            </p>

            <div style={{
              background: "rgba(255, 255, 255, 0.6)",
              border: "1.5px solid #EDEAE4",
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 28,
              textAlign: "left"
            }}>
              <div style={{
                background: "rgba(255, 171, 0, 0.05)",
                borderBottom: "1px solid #EDEAE4",
                padding: "10px 16px",
                fontSize: 11,
                fontWeight: 700,
                color: "#E65100",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                Low Stock Catalog Items
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {lowStockItems.map((item, idx) => (
                  <div 
                    key={item._id} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "12px 16px",
                      borderBottom: idx < lowStockItems.length - 1 ? "1px solid #EDEAE4" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={getThumbnail(item)}
                        alt={item.name}
                        onError={(event) => handleThumbnailError(event, item.type === "Oil" ? "/oils_category.jpg" : "/spices_category.jpg")}
                        style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover", border: "1px solid #EDEAE4", flexShrink: 0 }}
                      />
                      <div>
                      <span style={{ fontWeight: 700, color: "#1A1A16", fontSize: 13 }}>{item.name}</span>
                      <span style={{ marginLeft: 8, fontSize: 11, color: "#8A8880" }}>({item.pack})</span>
                      </div>
                    </div>
                    <span style={{ 
                      color: "#C0392B", 
                      background: "#FFF3F0", 
                      padding: "4px 10px", 
                      borderRadius: 12, 
                      fontSize: 11, 
                      fontWeight: 800 
                    }}>
                      {item.stock} Left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 14 }}>
              <button
                onClick={() => setShowLowStockModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: "1.5px solid #EDEAE4",
                  background: "#fff",
                  color: "#4A4840",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseEnter={(e) => e.target.style.background = "#FAFAF8"}
                onMouseLeave={(e) => e.target.style.background = "#fff"}
              >
                Acknowledge
              </button>
              <button
                onClick={() => {
                  setShowLowStockModal(false);
                  setActiveTab("inventory");
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: "#1A1A16",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: "0 4px 12px rgba(26, 26, 22, 0.15)"
                }}
                onMouseEnter={(e) => e.target.style.background = "#3A3A36"}
                onMouseLeave={(e) => e.target.style.background = "#1A1A16"}
              >
                Update Stock Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
