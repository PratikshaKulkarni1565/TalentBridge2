import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiUsers, FiBriefcase, FiMessageSquare,
  FiAward, FiGlobe, FiCheckCircle, FiArrowRight,
  FiMapPin, FiMenu, FiX, FiStar, FiTrendingUp,
  FiCode, FiHeart, FiBookmark,
} from "react-icons/fi";

/* ── animation variants ─────────────────────────────────────────────────── */
const fadeUp  = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
const fadeIn  = { hidden: { opacity: 0 },         show: { opacity: 1,       transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const floatAnim = { y: [0, -8, 0], transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } };

/* ── static data ─────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: <FiUser size={20} />,          title: "Build Your Profile",        desc: "Showcase your education, experience, skills, projects, and achievements in one professional space." },
  { icon: <FiUsers size={20} />,         title: "Connect with Professionals", desc: "Discover and connect with people who share your interests and career goals across every industry." },
  { icon: <FiBriefcase size={20} />,     title: "Discover Opportunities",     desc: "Find internships, jobs, projects, and career opportunities that match your skills and ambitions." },
  { icon: <FiMessageSquare size={20} />, title: "Share Your Journey",         desc: "Share posts, achievements, projects, and professional updates with your growing network." },
  { icon: <FiAward size={20} />,         title: "Showcase Your Skills",       desc: "Highlight your technical and professional skills and let your profile speak for itself." },
  { icon: <FiGlobe size={20} />,         title: "Grow Your Network",          desc: "Build meaningful professional relationships and expand your career possibilities worldwide." },
];

const STEPS = [
  { num: "01", title: "Create Your Profile",    desc: "Build a professional profile that represents your skills, experience, education, and achievements." },
  { num: "02", title: "Connect & Engage",       desc: "Connect with professionals, students, recruiters, and organizations that align with your goals." },
  { num: "03", title: "Discover Opportunities", desc: "Explore jobs, internships, projects, and other career opportunities tailored to your profile." },
  { num: "04", title: "Grow Your Career",       desc: "Build relationships, showcase your work, and move steadily toward your career goals." },
];

const OPPORTUNITIES = [
  { role: "Frontend Developer Intern", company: "TechNova",  location: "Remote",         skills: ["React", "JavaScript", "CSS"],    type: "Internship",  color: "#3b82f6" },
  { role: "Product Designer",          company: "DesignHub", location: "New York, NY",   skills: ["Figma", "UX", "Prototyping"],    type: "Full-time",   color: "#8b5cf6" },
  { role: "Data Analyst",              company: "DataFlow",  location: "San Francisco",  skills: ["Python", "SQL", "Tableau"],      type: "Full-time",   color: "#10b981" },
  { role: "Backend Engineer",          company: "CloudBase", location: "Austin, TX",     skills: ["Node.js", "AWS", "MongoDB"],     type: "Contract",    color: "#f59e0b" },
];

const POSTS = [
  { avatar: "AK", name: "Aisha Khan",    role: "Software Engineer", color: "#3b82f6", text: "Just shipped a new feature using React Server Components! The performance gains are incredible. Happy to share what I learned 🚀", likes: 48,  comments: 12 },
  { avatar: "MR", name: "Marcus Rivera", role: "Product Manager",   color: "#8b5cf6", text: "Excited to announce I've accepted an offer at my dream company! TalentBridge made it possible — connected me with the right people at the right time. 🎉", likes: 134, comments: 31 },
  { avatar: "SL", name: "Sophie Lee",    role: "UX Designer",       color: "#10b981", text: "Working on a case study about accessibility in mobile design. Would love feedback from designers and developers in my network!", likes: 62,  comments: 19 },
];

const NAV_LINKS = ["Features", "How It Works", "Opportunities", "Community"];

/* ── sub-components ──────────────────────────────────────────────────────── */

const HeroVisual = () => (
  <div className="lp-hero-visual">
    <div className="lp-hero-glow" />

    {/* profile card */}
    <motion.div className="lp-card lp-profile-card" animate={floatAnim}>
      <div className="lp-profile-cover" />
      <div className="lp-profile-body">
        <div className="lp-profile-avatar-ring">
          <div className="lp-profile-avatar-inner">JD</div>
        </div>
        <p className="lp-profile-name">Jordan Davis</p>
        <p className="lp-profile-title">Full-Stack Developer · Open to Work</p>
        <div className="lp-profile-skills">
          {["React", "Node.js", "TypeScript"].map(s => (
            <span key={s} className="lp-skill-chip">{s}</span>
          ))}
        </div>
        <div className="lp-profile-stats-row">
          <span><strong>248</strong> Connections</span>
          <span><strong>1.2k</strong> Profile views</span>
        </div>
        <button className="lp-connect-btn">+ Connect</button>
      </div>
    </motion.div>

    {/* floating job card */}
    <motion.div
      className="lp-card lp-job-float"
      animate={{ y: [0, 6, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }}
    >
      <div className="lp-job-float-icon"><FiBriefcase size={16} /></div>
      <div>
        <p className="lp-job-float-title">Frontend Engineer</p>
        <p className="lp-job-float-meta">TechNova · Remote · Full-time</p>
      </div>
      <span className="lp-job-float-badge">New</span>
    </motion.div>

    {/* floating connection card */}
    <motion.div
      className="lp-card lp-conn-float"
      animate={{ y: [0, -6, 0], transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 } }}
    >
      <div className="lp-conn-avatars">
        {["MK", "SR", "AL"].map((i, idx) => (
          <div key={i} className="lp-conn-avatar" style={{ marginLeft: idx ? -8 : 0 }}>{i}</div>
        ))}
      </div>
      <p className="lp-conn-text"><strong>+12 new connections</strong> this week</p>
    </motion.div>
  </div>
);

/* ── main component ──────────────────────────────────────────────────────── */
const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="lp-root">

      {/* ════════════════ NAVBAR ════════════════ */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/landing" className="lp-brand">
            <span className="lp-brand-talent">Talent</span><span className="lp-brand-bridge">Bridge</span>
          </Link>

          <nav className="lp-nav-links">
            {NAV_LINKS.map(l => (
              <button key={l} className="lp-nav-link" onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, "-"))}>
                {l}
              </button>
            ))}
          </nav>

          <div className="lp-nav-actions">
            <Link to="/login"  className="lp-btn-ghost">Sign In</Link>
            <Link to="/signup" className="lp-btn-primary">Get Started</Link>
          </div>

          <button className="lp-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="lp-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              {NAV_LINKS.map(l => (
                <button key={l} className="lp-mobile-link" onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, "-"))}>
                  {l}
                </button>
              ))}
              <div className="lp-mobile-auth">
                <Link to="/login"  className="lp-btn-ghost"   onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" className="lp-btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════ HERO ════════════════ */}
      <section className="lp-hero" id="features">
        <div className="lp-container lp-hero-inner">
          <motion.div className="lp-hero-left" variants={stagger} initial="hidden" animate="show">
            <motion.span className="lp-badge" variants={fadeUp}>
              Connect · Grow · Succeed
            </motion.span>
            <motion.h1 className="lp-hero-h1" variants={fadeUp}>
              Build Your <span className="lp-accent">Professional Network.</span>{" "}
              Discover Your <span className="lp-accent">Next Opportunity.</span>
            </motion.h1>
            <motion.p className="lp-hero-sub" variants={fadeUp}>
              TalentBridge connects students, professionals, recruiters, and organizations in one platform where opportunities, skills, and meaningful professional connections meet.
            </motion.p>
            <motion.div className="lp-hero-btns" variants={fadeUp}>
              <Link to="/signup" className="lp-btn-primary lp-btn-lg">
                Get Started <FiArrowRight size={16} />
              </Link>
              <button className="lp-btn-outline lp-btn-lg" onClick={() => scrollTo("how-it-works")}>
                Explore TalentBridge
              </button>
            </motion.div>
            <motion.p className="lp-hero-trust" variants={fadeUp}>
              Build your network &nbsp;·&nbsp; Showcase your skills &nbsp;·&nbsp; Discover opportunities
            </motion.p>
          </motion.div>

          <motion.div
            className="lp-hero-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* ════════════════ STATS ════════════════ */}
      <motion.section
        className="lp-stats-bar"
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={stagger}
      >
        {[
          { val: "10K+", lbl: "Professionals" },
          { val: "25K+", lbl: "Connections Made" },
          { val: "5K+",  lbl: "Opportunities" },
          { val: "100+", lbl: "Organizations" },
        ].map(s => (
          <motion.div key={s.lbl} className="lp-stat" variants={fadeUp}>
            <span className="lp-stat-val">{s.val}</span>
            <span className="lp-stat-lbl">{s.lbl}</span>
          </motion.div>
        ))}
      </motion.section>

      {/* ════════════════ FEATURES ════════════════ */}
      <motion.section
        className="lp-section"
        id="features"
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="lp-container">
          <motion.div className="lp-section-hd" variants={fadeUp}>
            <span className="lp-section-label">Platform Features</span>
            <h2>Everything You Need to Grow Your Career</h2>
            <p>TalentBridge brings professional networking, career discovery, and personal branding together in one place.</p>
          </motion.div>
          <div className="lp-features-grid">
            {FEATURES.map(f => (
              <motion.div key={f.title} className="lp-feature-card" variants={fadeUp}>
                <div className="lp-feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <motion.section
        className="lp-section lp-section-dark"
        id="how-it-works"
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="lp-container">
          <motion.div className="lp-section-hd" variants={fadeUp}>
            <span className="lp-section-label">Getting Started</span>
            <h2>How TalentBridge Works</h2>
            <p>Get started in minutes and unlock your professional potential.</p>
          </motion.div>
          <div className="lp-steps-row">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <motion.div className="lp-step" variants={fadeUp}>
                  <div className="lp-step-num">{s.num}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </motion.div>
                {i < STEPS.length - 1 && <div className="lp-step-connector" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ════════════════ PROFILE SHOWCASE ════════════════ */}
      <motion.section
        className="lp-section"
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="lp-container lp-showcase-inner">
          <motion.div className="lp-showcase-visual" variants={fadeIn}>
            <div className="lp-mock-profile">
              <div className="lp-mock-cover" />
              <div className="lp-mock-body">
                <div className="lp-mock-avatar">JD</div>
                <h3 className="lp-mock-name">Jordan Davis</h3>
                <p className="lp-mock-title">Full-Stack Developer</p>
                <p className="lp-mock-loc"><FiMapPin size={12} /> San Francisco, CA</p>
                <div className="lp-mock-skills">
                  {["React", "Node.js", "TypeScript", "AWS", "MongoDB"].map(s => (
                    <span key={s} className="lp-skill-chip">{s}</span>
                  ))}
                </div>
                <div className="lp-mock-divider" />
                <div className="lp-mock-section-title">Experience</div>
                <div className="lp-mock-exp">
                  <div className="lp-mock-exp-dot" />
                  <div>
                    <p className="lp-mock-exp-role">Senior Developer · TechNova</p>
                    <p className="lp-mock-exp-date">2022 – Present</p>
                  </div>
                </div>
                <div className="lp-mock-exp">
                  <div className="lp-mock-exp-dot" />
                  <div>
                    <p className="lp-mock-exp-role">Developer Intern · CloudBase</p>
                    <p className="lp-mock-exp-date">2021 – 2022</p>
                  </div>
                </div>
                <div className="lp-mock-divider" />
                <div className="lp-mock-stats">
                  <div><strong>248</strong><span>Connections</span></div>
                  <div><strong>1.2k</strong><span>Profile views</span></div>
                  <div><strong>34</strong><span>Posts</span></div>
                </div>
                <button className="lp-connect-btn" style={{ marginTop: 14 }}>+ Connect</button>
              </div>
            </div>
          </motion.div>

          <motion.div className="lp-showcase-text" variants={stagger}>
            <motion.span className="lp-section-label" variants={fadeUp}>Your Professional Identity</motion.span>
            <motion.h2 variants={fadeUp}>Your Professional Identity, All in One Place</motion.h2>
            <motion.p variants={fadeUp}>
              Create a profile that goes beyond a resume. Showcase your skills, projects, achievements, experience, and professional journey — all in one place that works for you 24/7.
            </motion.p>
            <motion.ul className="lp-showcase-list" variants={stagger}>
              {[
                "Rich profile with skills, experience & education",
                "Project portfolio and achievement highlights",
                "Professional connections and endorsements",
                "Activity feed visible to your network",
              ].map(item => (
                <motion.li key={item} variants={fadeUp}>
                  <FiCheckCircle size={16} className="lp-check-icon" /> {item}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp}>
              <Link to="/signup" className="lp-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                Create Your Profile <FiArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════════ OPPORTUNITIES ════════════════ */}
      <motion.section
        className="lp-section lp-section-dark"
        id="opportunities"
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="lp-container">
          <motion.div className="lp-section-hd" variants={fadeUp}>
            <span className="lp-section-label">Career Opportunities</span>
            <h2>Discover Opportunities That Match Your Potential</h2>
            <p>Browse roles from companies and organizations actively looking for talent like yours.</p>
          </motion.div>
          <div className="lp-opp-grid">
            {OPPORTUNITIES.map(o => (
              <motion.div key={o.role} className="lp-opp-card" variants={fadeUp}>
                <div className="lp-opp-header">
                  <div className="lp-opp-logo" style={{ background: o.color + "22", color: o.color }}>
                    <FiBriefcase size={18} />
                  </div>
                  <span className="lp-opp-type" style={{ background: o.color + "22", color: o.color }}>{o.type}</span>
                </div>
                <h4 className="lp-opp-role">{o.role}</h4>
                <p className="lp-opp-company">{o.company}</p>
                <p className="lp-opp-loc"><FiMapPin size={12} /> {o.location}</p>
                <div className="lp-opp-skills">
                  {o.skills.map(s => <span key={s} className="lp-skill-chip">{s}</span>)}
                </div>
                <Link to="/signup" className="lp-opp-btn">Explore Role <FiArrowRight size={13} /></Link>
              </motion.div>
            ))}
          </div>
          <motion.div className="lp-opp-cta" variants={fadeUp}>
            <Link to="/signup" className="lp-btn-outline">
              View All Opportunities <FiArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ════════════════ COMMUNITY ════════════════ */}
      <motion.section
        className="lp-section"
        id="community"
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="lp-container">
          <motion.div className="lp-section-hd" variants={fadeUp}>
            <span className="lp-section-label">Community</span>
            <h2>More Than a Network. A Community.</h2>
            <p>See what professionals are sharing, celebrating, and discussing on TalentBridge every day.</p>
          </motion.div>
          <div className="lp-posts-grid">
            {POSTS.map(post => (
              <motion.div key={post.name} className="lp-post-card" variants={fadeUp}>
                <div className="lp-post-header">
                  <div className="lp-post-avatar" style={{ background: post.color }}>{post.avatar}</div>
                  <div>
                    <p className="lp-post-name">{post.name}</p>
                    <p className="lp-post-role">{post.role}</p>
                  </div>
                </div>
                <p className="lp-post-text">{post.text}</p>
                <div className="lp-post-actions">
                  <span><FiHeart size={14} /> {post.likes}</span>
                  <span><FiMessageSquare size={14} /> {post.comments}</span>
                  <span><FiBookmark size={14} /></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <motion.section
        className="lp-cta-section"
        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <div className="lp-cta-glow" />
        <div className="lp-container lp-cta-inner">
          <h2>Ready to Build Your Professional Future?</h2>
          <p>Join TalentBridge and start connecting with people, opportunities, and experiences that can shape your career.</p>
          <div className="lp-cta-btns">
            <Link to="/signup" className="lp-btn-primary lp-btn-lg">
              Get Started <FiArrowRight size={16} />
            </Link>
            <Link to="/login" className="lp-btn-ghost-white lp-btn-lg">Sign In</Link>
          </div>
        </div>
      </motion.section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-top">
            <div className="lp-footer-brand-col">
              <span className="lp-brand lp-footer-logo">
                <span className="lp-brand-talent">Talent</span><span className="lp-brand-bridge">Bridge</span>
              </span>
              <p className="lp-footer-desc">
                TalentBridge is a professional networking platform designed to help people connect, showcase their skills, and discover career opportunities.
              </p>
            </div>

            <div className="lp-footer-cols">
              <div className="lp-footer-col">
                <p className="lp-footer-col-title">Platform</p>
                <button className="lp-footer-link" onClick={() => scrollTo("features")}>Features</button>
                <button className="lp-footer-link" onClick={() => scrollTo("opportunities")}>Opportunities</button>
                <button className="lp-footer-link" onClick={() => scrollTo("community")}>Community</button>
                <button className="lp-footer-link" onClick={() => scrollTo("how-it-works")}>How It Works</button>
              </div>
              <div className="lp-footer-col">
                <p className="lp-footer-col-title">Account</p>
                <Link to="/signup" className="lp-footer-link">Get Started</Link>
                <Link to="/login"  className="lp-footer-link">Sign In</Link>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <p>© {new Date().getFullYear()} TalentBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
