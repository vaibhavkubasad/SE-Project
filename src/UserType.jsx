import React, { useState } from "react";

export default function UserType({ onBack, onSelect, onLoginSuccess, selectedType }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!selectedType) return;

    if (!username.trim() || !password.trim()) {
      setMessage("Enter both username and password.");
      setMessageType("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      setMessageType("");

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedType,
          name: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        onLoginSuccess?.(data.user);
        return;
      }

      setMessage(data.msg || "Invalid username or password.");
      setMessageType("error");
    } catch (error) {
      setMessage(
        "Could not reach the login service. Make sure the API server is running."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleSelect(role) {
    onSelect(role);
    setUsername("");
    setPassword("");
    setMessage("");
    setMessageType("");
  }

  return (
    <div className="user-type-page">
      <div className="user-type-panel">
        <div className="user-type-brand" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{
            background: "#556B2F", borderRadius: "50%", width: "46px", height: "46px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: "700", color: "#FAF7F2", fontFamily: "'Playfair Display', serif",
            flexShrink: 0
          }}>AA</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#2B2B2B", letterSpacing: "0.03em", fontFamily: "'Playfair Display', serif", lineHeight: "1.1" }}>Akalwadi</div>
            <div style={{ fontSize: "9px", color: "#7A8279", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "600", marginTop: "2px" }}>Associates</div>
          </div>
        </div>
        <h1>Select User Type</h1>
        <p className="user-type-description">
          Choose the role you want to continue with and proceed to the next step.
        </p>

        {selectedType ? (
          <div className="user-type-selected">
            <p>You selected:</p>
            <strong>{selectedType}</strong>
            <div style={{ marginTop: 8, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => handleRoleSelect("")}
                style={{
                  background: "none",
                  border: "1.5px solid var(--accent)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 12,
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.15s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(212, 160, 23, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                }}
              >
                🔄 Select a different role
              </button>
            </div>
            <p>Enter your username and password to continue.</p>

            <div className="user-type-form">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleLogin()}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                className="user-type-login-button"
                onClick={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking..." : `Login as ${selectedType}`}
              </button>
              {message ? (
                <p className={`user-type-message user-type-message-${messageType || "info"}`}>
                  {message}
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="user-type-buttons">
            <button onClick={() => handleRoleSelect("Admin")}>Admin</button>
            <button onClick={() => handleRoleSelect("Wholesaler")}>Wholesaler</button>
            <button onClick={() => handleRoleSelect("Manager")}>Manager</button>
          </div>
        )}

        <button className="back-button" onClick={onBack}>
          Back to homepage
        </button>
      </div>
    </div>
  );
}
