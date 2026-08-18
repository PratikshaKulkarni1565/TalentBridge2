import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import PageHero from "../../components/PageHero";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const ACCENT_LABELS = { teal: "Teal", blue: "Blue", green: "Green", purple: "Purple", orange: "Orange" };
const ACCENT_HEX    = { teal: "#00A896", blue: "#2563EB", green: "#16A34A", purple: "#7C3AED", orange: "#EA580C" };

const Settings = () => {
  const { user, logout }          = useAuth();
  const { mode, setMode, accent, setAccent } = useTheme();
  const navigate                  = useNavigate();
  const [activeTab, setActiveTab] = useState("account");

  const savedPosts = JSON.parse(localStorage.getItem("tb_saved_posts_data") || "[]");
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80"
        title="Settings"
        subtitle="Manage your account, theme, and saved content"
        height={220}
      />
      <div className="page-container">
        <div className="feed-column">
          <div className="settings-tabs">
            {["account", "theme", "saved"].map((tab) => (
              <button key={tab} type="button" className={`tab-btn ${activeTab === tab ? "active-tab" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab === "account" ? "⚙️ Account" : tab === "theme" ? "🎨 Theme" : "⭐ Saved Posts"}
              </button>
            ))}
          </div>

          {activeTab === "account" && (
            <>
              <div className="settings-card">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
              <div className="settings-card">
                <h4>Session</h4>
                <button onClick={handleLogout}>Log out</button>
              </div>
              <div className="settings-card">
                <h4>Danger Zone</h4>
                <p className="muted">Account deletion is not enabled in this demo build.</p>
              </div>
            </>
          )}

          {activeTab === "theme" && (
            <div className="settings-card">
              <h4>Theme Mode</h4>
              <div className="theme-mode-row">
                {["light", "dark", "system"].map((m) => (
                  <button key={m} type="button" className={`theme-mode-btn ${mode === m ? "active-theme" : ""}`} onClick={() => setMode(m)}>
                    {m === "light" ? "☀️ Light" : m === "dark" ? "🌙 Dark" : "💻 System"}
                  </button>
                ))}
              </div>
              <h4 style={{ marginTop: 20 }}>Accent Color</h4>
              <div className="accent-row">
                {Object.entries(ACCENT_LABELS).map(([key, label]) => (
                  <button key={key} type="button" className={`accent-btn ${accent === key ? "active-accent" : ""}`}
                    style={{ "--accent-color": ACCENT_HEX[key] }} onClick={() => setAccent(key)}>
                    <span className="accent-dot" style={{ background: ACCENT_HEX[key] }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div>
              <h4>Saved Posts ({savedPosts.length})</h4>
              {savedPosts.length === 0 ? (
                <p className="muted">No saved posts yet. Click ⭐ Save on any post.</p>
              ) : (
                savedPosts.map((post) => (
                  <div key={post._id} className="post-card">
                    <div className="post-header">
                      <img src={post.userId?.profilePicture ? `${API_ROOT}${post.userId.profilePicture}` : "https://via.placeholder.com/40"} alt="avatar" />
                      <div>
                        <strong>{post.userId?.name}</strong>
                        <p className="muted">{post.userId?.headline}</p>
                      </div>
                    </div>
                    {post.text && <div className="post-text" dangerouslySetInnerHTML={{ __html: post.text }} />}
                    {post.image && <img className="post-image" src={`${API_ROOT}${post.image}`} alt="post" />}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
