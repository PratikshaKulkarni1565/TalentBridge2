import React, { useEffect, useState } from "react";
import api from "../../services/api";
import PageHero from "../../components/PageHero";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const { data } = await api.get("/jobs");
      // Filter to show only jobs posted by current employer
      const user = JSON.parse(localStorage.getItem("tb_user"));
      const myJobs = data.filter(job => job.createdBy._id === user._id);
      setJobs(myJobs);
      if (myJobs.length > 0) {
        setSelectedJob(myJobs[0]);
        loadApplicants(myJobs[0]._id);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (jobId) => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplicants(data);
    } catch (err) {
      console.error("Failed to load applicants:", err);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    loadApplicants(job._id);
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      loadApplicants(selectedJob._id);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

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

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return <div className="page-container">Loading dashboard...</div>;
  }

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&q=80"
        title="Employer Dashboard"
        subtitle="Manage your job postings and review applicants"
        height={240}
      />
      <div className="page-container">
        <div className="feed-column">
          {jobs.length === 0 ? (
            <div className="post-card" style={{ textAlign: "center", padding: "40px" }}>
              <p className="muted">You haven't posted any jobs yet.</p>
              <a href="/jobs" style={{ color: "#6366f1", textDecoration: "none" }}>Post a Job →</a>
            </div>
          ) : (
            <>
              <div className="post-card">
                <h3 style={{ marginBottom: 16 }}>My Jobs</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {jobs.map((job) => (
                    <button
                      key={job._id}
                      onClick={() => handleJobSelect(job)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: selectedJob?._id === job._id ? "2px solid #6366f1" : "1px solid #e5e7eb",
                        backgroundColor: selectedJob?._id === job._id ? "#f5f3ff" : "white",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      {job.title} ({job.company})
                    </button>
                  ))}
                </div>
              </div>

              {selectedJob && (
                <div className="post-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3>Applicants for {selectedJob.title}</h3>
                    <span className="muted">{applicants.length} applicant{applicants.length !== 1 ? "s" : ""}</span>
                  </div>

                  {applicants.length === 0 ? (
                    <p className="muted">No applicants yet.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {applicants.map((app) => (
                        <div
                          key={app._id}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "16px",
                            backgroundColor: "#fafafa"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: 8 }}>
                                <img
                                  src={app.applicantId?.profilePicture
                                    ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${app.applicantId.profilePicture}`
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantId?.name || "U")}&background=00A896&color=fff&size=40`}
                                  alt={app.applicantId?.name}
                                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                                />
                                <div>
                                  <h4 style={{ margin: 0 }}>{app.applicantId?.name}</h4>
                                  <p className="muted" style={{ margin: 0, fontSize: "14px" }}>{app.applicantId?.email}</p>
                                </div>
                              </div>

                              {app.applicantId?.headline && (
                                <p className="muted" style={{ fontSize: "14px", marginBottom: 8 }}>{app.applicantId.headline}</p>
                              )}

                              {app.applicantId?.skills?.length > 0 && (
                                <div style={{ marginBottom: 8 }}>
                                  <strong style={{ fontSize: "13px" }}>Skills:</strong>
                                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
                                    {app.applicantId.skills.map((skill, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          padding: "2px 8px",
                                          borderRadius: "12px",
                                          fontSize: "12px",
                                          backgroundColor: "#e0e7ff",
                                          color: "#6366f1"
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {app.coverLetter && (
                                <div style={{ marginTop: 8 }}>
                                  <strong style={{ fontSize: "13px" }}>Cover Letter:</strong>
                                  <p style={{ fontSize: "14px", marginTop: 4, backgroundColor: "white", padding: "8px", borderRadius: "4px" }}>
                                    {app.coverLetter}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
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

                              <select
                                value={app.status}
                                onChange={(e) => updateStatus(app._id, e.target.value)}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  border: "1px solid #d1d5db",
                                  fontSize: "13px",
                                  cursor: "pointer"
                                }}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interview">Interview</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
