import React, { useEffect, useState } from "react";
import api from "../../services/api";
import PageHero from "../../components/PageHero";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      const { data } = await api.get("/applications/my-applications");
      setApplications(data);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied": return "#6366f1";
      case "Shortlisted": return "#10b981";
      case "Interview": return "#f59e0b";
      case "Rejected": return "#ef4444";
      case "Hired": return "#22c55e";
      default: return "#6b7280";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return <div className="page-container">Loading applications...</div>;
  }

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80"
        title="My Applications"
        subtitle="Track your job applications and their status"
        height={240}
      />
      <div className="page-container">
        <div className="feed-column">
          {applications.length === 0 ? (
            <div className="post-card" style={{ textAlign: "center", padding: "40px" }}>
              <p className="muted">You haven't applied to any jobs yet.</p>
              <a href="/jobs" style={{ color: "#6366f1", textDecoration: "none" }}>Browse Jobs →</a>
            </div>
          ) : (
            <div className="post-card">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
                    <th style={{ padding: "12px 8px" }}>Job</th>
                    <th style={{ padding: "12px 8px" }}>Company</th>
                    <th style={{ padding: "12px 8px" }}>Applied On</th>
                    <th style={{ padding: "12px 8px" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 8px" }}>
                        <div style={{ fontWeight: "500" }}>{app.jobId?.title}</div>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <div className="muted">{app.jobId?.company}</div>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <div className="muted">{formatDate(app.createdAt)}</div>
                      </td>
                      <td style={{ padding: "12px 8px" }}>
                        <span 
                          style={{ 
                            padding: "4px 12px", 
                            borderRadius: "20px", 
                            fontSize: "12px", 
                            fontWeight: "500",
                            backgroundColor: `${getStatusColor(app.status)}20`,
                            color: getStatusColor(app.status)
                          }}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
