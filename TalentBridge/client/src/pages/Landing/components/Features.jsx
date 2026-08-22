import React from "react";
import { motion } from "framer-motion";
import {
  FiUser, FiUsers, FiBriefcase, FiMessageSquare, FiAward, FiTrendingUp,
} from "react-icons/fi";
import { FEATURES } from "../data";
import { fadeUp, stagger } from "../animations";

const ICONS = {
  user: FiUser,
  users: FiUsers,
  briefcase: FiBriefcase,
  message: FiMessageSquare,
  award: FiAward,
  trending: FiTrendingUp,
};

const Features = () => (
  <motion.section
    className="lp-section"
    id="features"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    variants={stagger}
  >
    <div className="lp-container">
      <motion.div className="lp-section-hd" variants={fadeUp}>
        <h2>Everything You Need to Grow Your Career</h2>
        <p>
          TalentBridge brings professional networking, career discovery, and personal branding together in one place.
        </p>
      </motion.div>
      <div className="lp-features-grid">
        {FEATURES.map(f => {
          const Icon = ICONS[f.icon];
          return (
            <motion.div key={f.title} className="lp-feature-card" variants={fadeUp}>
              <div className="lp-feature-icon"><Icon size={20} /></div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.section>
);

export default Features;
