import React from "react";
import { motion } from "framer-motion";
import { FiBriefcase } from "react-icons/fi";
import { floatAnim, floatAnimSlow } from "../animations";

const HeroVisual = () => (
  <div className="lp-hero-visual">
    <div className="lp-hero-glow" />

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
          <span><strong>1.2K</strong> Views</span>
        </div>
        <button type="button" className="lp-connect-btn">+ Connect</button>
      </div>
    </motion.div>

    <motion.div
      className="lp-card lp-job-float"
      animate={{ y: [0, 6, 0], transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
    >
      <div className="lp-job-float-icon"><FiBriefcase size={16} /></div>
      <div>
        <p className="lp-job-float-title">Senior Frontend Engineer</p>
        <p className="lp-job-float-meta">Remote · Full-time</p>
      </div>
      <span className="lp-job-float-badge">New</span>
    </motion.div>

    <motion.div
      className="lp-card lp-conn-float"
      animate={{ y: [0, -6, 0], transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 } }}
    >
      <div className="lp-conn-avatars">
        {["MK", "SR", "AL"].map((initial, idx) => (
          <div key={initial} className="lp-conn-avatar" style={{ marginLeft: idx ? -8 : 0 }}>
            {initial}
          </div>
        ))}
      </div>
      <p className="lp-conn-text"><strong>+12 connections</strong> this week</p>
    </motion.div>

    <motion.div className="lp-card lp-progress-float" animate={floatAnimSlow}>
      <div className="lp-progress-label">
        <span>Profile Strength</span>
        <strong>78%</strong>
      </div>
      <div className="lp-progress-bar">
        <div className="lp-progress-fill" />
      </div>
    </motion.div>
  </div>
);

export default HeroVisual;
