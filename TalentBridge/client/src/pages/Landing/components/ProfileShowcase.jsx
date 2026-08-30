import React from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiBriefcase, FiEye, FiArrowRight } from "react-icons/fi";
import { fadeUp, stagger } from "../animations";

const ProfileShowcase = () => (
  <motion.section
    className="lp-section lp-section-alt"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    variants={stagger}
  >
    <div className="lp-container">
      <motion.div className="lp-section-hd" variants={fadeUp}>
        <span className="lp-section-label">Profile Showcase</span>
        <h2>Your Professional Identity, Beautifully Presented</h2>
        <p>
          Showcase your skills, experience, and achievements while discovering opportunities tailored to your profile.
        </p>
      </motion.div>

      <div className="lp-showcase-grid">
        <motion.div className="lp-mock-profile" variants={fadeUp}>
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
              <div><strong>1.2K</strong><span>Profile Views</span></div>
              <div><strong>24</strong><span>Posts</span></div>
            </div>
            <button type="button" className="lp-connect-btn" style={{ width: "100%" }}>+ Connect</button>
          </div>
        </motion.div>

        <motion.div className="lp-showcase-side" variants={stagger}>
          <motion.div className="lp-opp-showcase-card" variants={fadeUp}>
            <span className="lp-opp-showcase-badge">
              <FiBriefcase size={12} /> New Opportunity
            </span>
            <h4>Senior Frontend Engineer</h4>
            <p className="lp-opp-showcase-meta">Remote · Full-time</p>
            <button type="button" className="lp-opp-showcase-btn">
              View Opportunity <FiArrowRight size={14} />
            </button>
          </motion.div>

          <motion.div className="lp-mini-stat-card" variants={fadeUp}>
            <div className="lp-mini-stat-icon"><FiEye size={20} /></div>
            <div className="lp-mini-stat-text">
              <strong>1.2K</strong>
              <span>Profile views this month</span>
            </div>
          </motion.div>

          <motion.div className="lp-mini-stat-card" variants={fadeUp}>
            <div className="lp-mini-stat-icon"><FiBriefcase size={20} /></div>
            <div className="lp-mini-stat-text">
              <strong>12</strong>
              <span>Matching opportunities</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default ProfileShowcase;
