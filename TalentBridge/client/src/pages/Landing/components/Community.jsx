import React from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiBriefcase, FiHome } from "react-icons/fi";
import { COMMUNITY } from "../data";
import { fadeUp, stagger } from "../animations";

const ICONS = {
  graduation: FiBookOpen,
  briefcase: FiBriefcase,
  building: FiHome,
};

const Community = () => (
  <motion.section
    className="lp-section lp-section-alt"
    id="community"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    variants={stagger}
  >
    <div className="lp-container">
      <motion.div className="lp-section-hd" variants={fadeUp}>
        <span className="lp-section-label">Community</span>
        <h2>Your Professional Community Starts Here</h2>
        <p>
          Whether you&apos;re starting out, advancing your career, or hiring top talent — TalentBridge is built for you.
        </p>
      </motion.div>
      <div className="lp-community-grid">
        {COMMUNITY.map(c => {
          const Icon = ICONS[c.icon];
          return (
            <motion.div key={c.title} className="lp-community-card" variants={fadeUp}>
              <div
                className="lp-community-icon"
                style={{ background: c.color + "14", color: c.color }}
              >
                <Icon size={24} />
              </div>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.section>
);

export default Community;
