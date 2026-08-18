import React, { useEffect, useState } from "react";
import api from "../../services/api";
import PageHero from "../../components/PageHero";

const Jobs = () => {
  const [jobs, setJobs]         = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({
    company: "", title: "", description: "",
    location: "", salary: "", jobType: "Full-time", skillsRequired: "",
  });

  const loadJobs = async () => {
    const { data } = await api.get("/jobs");
    setJobs(data);
  };

  useEffect(() => { loadJobs(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/jobs", {
      ...form,
      skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setForm({ company: "", title: "", description: "", location: "", salary: "", jobType: "Full-time", skillsRequired: "" });
    setShowForm(false);
    loadJobs();
  };

  const handleApply = async (jobId) => {
    try {
      await api.put(`/jobs/${jobId}/apply`);
      alert("Application submitted!");
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Could not apply");
    }
  };

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80"
        title="Job Openings"
        subtitle="Find your next opportunity — browse roles matched to your skills"
        height={240}
      />
      <div className="page-container">
        <div className="feed-column">
          <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: 16 }}>
            {showForm ? "Cancel" : "+ Post a Job"}
          </button>

          {showForm && (
            <div className="post-card">
              <form onSubmit={handleCreate} className="job-form">
                <input placeholder="Job title"   value={form.title}       onChange={(e) => setForm({ ...form, title: e.target.value })}       required />
                <input placeholder="Company"     value={form.company}     onChange={(e) => setForm({ ...form, company: e.target.value })}     required />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                <input placeholder="Location"    value={form.location}    onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <input placeholder="Salary"      value={form.salary}      onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
                <input placeholder="Skills required (comma separated)" value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
                <button type="submit">Publish Job</button>
              </form>
            </div>
          )}

          {jobs.length === 0 && <p className="muted">No jobs posted yet.</p>}
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div className="job-company-logo">{job.company?.[0]?.toUpperCase()}</div>
                <div>
                  <h4>{job.title}</h4>
                  <p className="muted">{job.company} · {job.location} · {job.jobType}</p>
                  {job.salary && <p className="muted">💰 {job.salary}</p>}
                </div>
              </div>
              <p className="job-desc">{job.description}</p>
              {job.skillsRequired?.length > 0 && (
                <div className="skill-tags">
                  {job.skillsRequired.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                </div>
              )}
              <button className="apply-btn" onClick={() => handleApply(job._id)}>Apply Now →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
