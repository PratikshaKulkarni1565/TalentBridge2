import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PageHero from "../../components/PageHero";
import { useAuth } from "../../context/AuthContext";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");
const avatar = (pic) => pic ? `${API_ROOT}${pic}` : "https://via.placeholder.com/40";

const Connections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [pending, setPending]         = useState([]);
  const [query, setQuery]             = useState("");
  const [results, setResults]         = useState([]);
  const [sent, setSent]               = useState(new Set());
  const [searching, setSearching]     = useState(false);

  const load = useCallback(async () => {
    const [{ data: connData }, { data: pendingData }] = await Promise.all([
      api.get("/connections"),
      api.get("/connections/pending"),
    ]);
    setConnections(connData);
    setPending(pendingData);
  }, []);

  useEffect(() => { load(); }, [load]);

  const respond = async (requestId, action) => {
    await api.put(`/connections/respond/${requestId}`, { action });
    load();
  };

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(query)}&type=users`);
      // exclude self and already-connected users
      const connIds = new Set(connections.map((c) => c._id));
      setResults((data.users || []).filter((u) => u._id !== user?._id && !connIds.has(u._id)));
    } finally {
      setSearching(false);
    }
  };

  const sendRequest = async (userId) => {
    try {
      await api.post(`/connections/request/${userId}`);
      setSent((prev) => new Set(prev).add(userId));
    } catch (err) {
      // already sent or connected — mark as sent anyway
      setSent((prev) => new Set(prev).add(userId));
    }
  };

  const removeConnection = async (userId) => {
    await api.delete(`/connections/${userId}`);
    load();
  };

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
        title="My Network"
        subtitle="Grow your professional connections and collaborate with peers"
        height={240}
      />
      <div className="page-container">
        <div className="feed-column">

          {/* ── Search People ── */}
          <div className="post-card">
            <h3 style={{ marginBottom: 12 }}>Find People</h3>
            <form onSubmit={search} className="search-form">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, skill or headline…"
              />
              <button type="submit" disabled={searching}>
                {searching ? "Searching…" : "Search"}
              </button>
            </form>
            {results.map((u) => (
              <div key={u._id} className="connection-card">
                <img src={avatar(u.profilePicture)} alt="avatar" />
                <div className="connection-info">
                  <strong>{u.name}</strong>
                  <p className="muted">{u.headline}</p>
                </div>
                <div className="connection-actions">
                  <Link to={`/profile/${u._id}`} style={{ marginRight: 8, color: "var(--tb-teal)" }}>View</Link>
                  <button
                    onClick={() => sendRequest(u._id)}
                    disabled={sent.has(u._id)}
                    className={sent.has(u._id) ? "secondary-btn" : ""}
                  >
                    {sent.has(u._id) ? "Requested" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
            {results.length === 0 && query && !searching && (
              <p className="muted">No users found for "{query}".</p>
            )}
          </div>

          {/* ── Pending Requests ── */}
          {pending.length > 0 && (
            <>
              <h3 className="section-title">Pending Requests ({pending.length})</h3>
              {pending.map((req) => (
                <div key={req._id} className="connection-card">
                  <img src={avatar(req.from.profilePicture)} alt="avatar" />
                  <div className="connection-info">
                    <strong>{req.from.name}</strong>
                    <p className="muted">{req.from.headline}</p>
                  </div>
                  <div className="connection-actions">
                    <button onClick={() => respond(req._id, "accept")}>Accept</button>
                    <button onClick={() => respond(req._id, "reject")} className="secondary-btn">Reject</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── My Connections ── */}
          <h3 className="section-title">My Connections ({connections.length})</h3>
          {connections.length === 0 && <p className="muted">You have no connections yet.</p>}
          {connections.map((c) => (
            <div key={c._id} className="connection-card">
              <Link to={`/profile/${c._id}`} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, textDecoration: "none", color: "inherit" }}>
                <img src={avatar(c.profilePicture)} alt="avatar" />
                <div className="connection-info">
                  <strong>{c.name}</strong>
                  <p className="muted">{c.headline}</p>
                </div>
              </Link>
              <button onClick={() => removeConnection(c._id)} className="secondary-btn" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                Remove
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Connections;
