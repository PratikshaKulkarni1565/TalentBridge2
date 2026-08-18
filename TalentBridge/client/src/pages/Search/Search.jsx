import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import api from "../../services/api";
import PageHero from "../../components/PageHero";

const API_ROOT = (import.meta.env.VITE_API_URL || "").replace("/api", "");
const SKILL_SUGGESTIONS = ["React", "Node.js", "Python", "Java", "AWS", "MongoDB", "TypeScript", "Docker"];
const EXPERIENCE_OPTIONS = ["0-1 years", "1-3 years", "3-5 years", "5+ years"];

const Search = () => {
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [skills, setSkills]         = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [company, setCompany]       = useState("");
  const [location, setLocation]     = useState("");
  const [experience, setExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() && skills.length === 0 && !company && !location) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (query)          params.set("q", query);
    if (skills.length)  params.set("skills", skills.join(","));
    if (company)        params.set("company", company);
    if (location)       params.set("location", location);
    if (experience)     params.set("experience", experience);
    const { data } = await api.get(`/search?${params.toString()}`);
    setResults(data);
    setLoading(false);
  };

  const activeFiltersCount = skills.length + (company ? 1 : 0) + (location ? 1 : 0) + (experience ? 1 : 0);

  return (
    <div>
      <PageHero
        image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80"
        title="Search TalentBridge"
        subtitle="Find people by skills, company, location, or experience"
        height={240}
      />
      <div className="page-container">
        <div className="feed-column">
          <form onSubmit={handleSearch} className="search-form">
            <input placeholder="Search people, skills, or jobs..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="button" className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              Filters {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
            </button>
            <button type="submit">Search</button>
          </form>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Skills</label>
                <div className="chip-input-row">
                  <input placeholder="Add skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); } }} style={{ marginBottom: 0 }} />
                  <button type="button" onClick={() => addSkill(skillInput)}>Add</button>
                </div>
                <div className="skill-suggestions">
                  {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                    <button key={s} type="button" className="suggestion-chip" onClick={() => addSkill(s)}>{s}</button>
                  ))}
                </div>
                <div className="chips-row">
                  {skills.map((s) => (
                    <span key={s} className="filter-chip">{s} <FiX onClick={() => setSkills(skills.filter((x) => x !== s))} /></span>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>Company</label>
                <input placeholder="e.g. Google" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Location</label>
                <input placeholder="e.g. New York" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Experience</label>
                <div className="chips-row">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <button key={opt} type="button" className={`suggestion-chip ${experience === opt ? "active-chip" : ""}`}
                      onClick={() => setExperience(experience === opt ? "" : opt)}>{opt}</button>
                  ))}
                </div>
              </div>
              {activeFiltersCount > 0 && (
                <button type="button" className="clear-filters-btn" onClick={() => { setSkills([]); setCompany(""); setLocation(""); setExperience(""); }}>
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {loading && <p className="muted">Searching...</p>}

          {results && (
            <>
              <h3 className="section-title">People</h3>
              {results.users?.length ? results.users.map((u) => (
                <Link to={`/profile/${u._id}`} key={u._id} className="search-result-card">
                  <img src={u.profilePicture ? `${API_ROOT}${u.profilePicture}` : "https://via.placeholder.com/40"} alt="avatar" />
                  <div>
                    <strong>{u.name}</strong>
                    <p className="muted">{u.headline}</p>
                    {u.skills?.length > 0 && (
                      <div className="chips-row" style={{ marginTop: 4 }}>
                        {u.skills.slice(0, 3).map((s) => <span key={s} className="skill-tag">{s}</span>)}
                      </div>
                    )}
                  </div>
                </Link>
              )) : <p className="muted">No people found.</p>}

              <h3 className="section-title">Jobs</h3>
              {results.jobs?.length ? results.jobs.map((j) => (
                <Link to="/jobs" key={j._id} className="search-result-card">
                  <div>
                    <strong>{j.title}</strong>
                    <p className="muted">{j.company} · {j.location}</p>
                  </div>
                </Link>
              )) : <p className="muted">No jobs found.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
