import React, { useEffect, useState } from "react";
import api from "../../services/api";
import PageHero from "../../components/PageHero";
import { useAuth } from "../../context/AuthContext";

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs]         = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm]         = useState({
    company: "", title: "", description: "",
    location: "", salary: "", jobType: "Full-time", skillsRequired: "",
    workplaceType: "On-site", employmentType: "Full-time", salaryMin: "", salaryMax: "",
    experienceLevel: "Fresher", education: "", applicationDeadline: ""
  });
  const [applyForm, setApplyForm] = useState({
    coverLetter: "", skills: "", experience: "", portfolio: "", linkedIn: ""
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
    setForm({ 
      company: "", title: "", description: "", location: "", salary: "", jobType: "Full-time", skillsRequired: "",
      workplaceType: "On-site", employmentType: "Full-time", salaryMin: "", salaryMax: "",
      experienceLevel: "Fresher", education: "", applicationDeadline: ""
    });
    setShowForm(false);
    loadJobs();
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplyForm({
      coverLetter: "",
      skills: user.skills?.join(", ") || "",
      experience: "",
      portfolio: "",
      linkedIn: ""
    });
    setShowApplyForm(true);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post("/applications", {
        jobId: selectedJob._id,
        ...applyForm,
        skills: applyForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      alert("Application submitted!");
      setShowApplyForm(false);
      setSelectedJob(null);
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
          {user.role === "employer" && (
            <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: 16 }}>
              {showForm ? "Cancel" : "+ Post a Job"}
            </button>
          )}

          {showForm && (
            <div className="post-card">
              <form onSubmit={handleCreate} className="job-form">
                <input placeholder="Job title"   value={form.title}       onChange={(e) => setForm({ ...form, title: e.target.value })}       required />
                <input placeholder="Company"     value={form.company}     onChange={(e) => setForm({ ...form, company: e.target.value })}     required />
                <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
                <input placeholder="Location"    value={form.location}    onChange={(e) => setForm({ ...form, location: e.target.value })} />
                
                <select value={form.workplaceType} onChange={(e) => setForm({ ...form, workplaceType: e.target.value })}>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                
                <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
                
                <input placeholder="Salary Min"      value={form.salaryMin}      onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
                <input placeholder="Salary Max"      value={form.salaryMax}      onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
                
                <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                  <option value="Fresher">Fresher</option>
                  <option value="0–1 years">0–1 years</option>
                  <option value="1–3 years">1–3 years</option>
                  <option value="3–5 years">3–5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
                
                <input placeholder="Education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} />
                <input 
                  type="date" 
                  placeholder="Application Deadline" 
                  value={form.applicationDeadline} 
                  onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} 
                />
                
                <input placeholder="Skills required (comma separated)" value={form.skillsRequired} onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })} />
                <button type="submit">Publish Job</button>
              </form>
            </div>
          )}

          {showApplyForm && selectedJob && (
            <div className="post-card">
              <h3 style={{ marginBottom: 16 }}>Apply for {selectedJob.title}</h3>
              <form onSubmit={handleApply}>
                <textarea 
                  placeholder="Cover Letter" 
                  value={applyForm.coverLetter} 
                  onChange={(e) => setApplyForm({ ...applyForm, coverLetter: e.target.value })} 
                  required
                  rows={4}
                  style={{ width: "100%", marginBottom: 12, padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
                <input 
                  placeholder="Skills (comma separated)" 
                  value={applyForm.skills} 
                  onChange={(e) => setApplyForm({ ...applyForm, skills: e.target.value })} 
                  style={{ width: "100%", marginBottom: 12, padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
                <input 
                  placeholder="Experience" 
                  value={applyForm.experience} 
                  onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })} 
                  style={{ width: "100%", marginBottom: 12, padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
                <input 
                  placeholder="Portfolio URL" 
                  value={applyForm.portfolio} 
                  onChange={(e) => setApplyForm({ ...applyForm, portfolio: e.target.value })} 
                  style={{ width: "100%", marginBottom: 12, padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
                <input 
                  placeholder="LinkedIn URL" 
                  value={applyForm.linkedIn} 
                  onChange={(e) => setApplyForm({ ...applyForm, linkedIn: e.target.value })} 
                  style={{ width: "100%", marginBottom: 12, padding: "8px", borderRadius: "4px", border: "1px solid #d1d5db" }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="submit" style={{ flex: 1 }}>Submit Application</button>
                  <button type="button" onClick={() => setShowApplyForm(false)} style={{ flex: 1, backgroundColor: "#6b7280" }}>Cancel</button>
                </div>
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
                  <p className="muted">{job.company} · {job.location} · {job.employmentType || job.jobType}</p>
                  <p className="muted">{job.workplaceType} · {job.experienceLevel}</p>
                  {(job.salaryMin || job.salaryMax || job.salary) && (
                    <p className="muted">💰 {job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax}` : job.salary}</p>
                  )}
                </div>
              </div>
              <p className="job-desc">{job.description}</p>
              {job.skillsRequired?.length > 0 && (
                <div className="skill-tags">
                  {job.skillsRequired.map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                </div>
              )}
              {user.role === "job_seeker" && (
                <button className="apply-btn" onClick={() => handleApplyClick(job)}>Apply Now →</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
