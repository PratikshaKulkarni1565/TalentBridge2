import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PageHero from "../../components/PageHero";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [pending, setPending]         = useState([]);

  const load = async () => {
    const [{ data: connData }, { data: pendingData }] = await Promise.all([
      api.get("/connections"),
      api.get("/connections/pending"),
    ]);
    setConnections(connData);
    setPending(pendingData);
  };

  useEffect(() => { load(); }, []);

  const respond = async (requestId, action) => {
    await api.put(`/connections/respond/${requestId}`, { action });
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
          {pending.length > 0 && (
            <>
              <h3 className="section-title">Pending Requests ({pending.length})</h3>
              {pending.map((req) => (
                <div key={req._id} className="connection-card">
                  <img src={req.from.profilePicture ? `${API_ROOT}${req.from.profilePicture}` : "https://via.placeholder.com/40"} alt="avatar" />
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

          <h3 className="section-title">My Connections ({connections.length})</h3>
          {connections.length === 0 && <p className="muted">You have no connections yet.</p>}
          {connections.map((c) => (
            <Link to={`/profile/${c._id}`} key={c._id} className="connection-card">
              <img src={c.profilePicture ? `${API_ROOT}${c.profilePicture}` : "https://via.placeholder.com/40"} alt="avatar" />
              <div className="connection-info">
                <strong>{c.name}</strong>
                <p className="muted">{c.headline}</p>
              </div>
              <span className="connection-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
