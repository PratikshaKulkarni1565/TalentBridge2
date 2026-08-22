import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBriefcase, FiMapPin, FiArrowRight } from "react-icons/fi";
import { OPPORTUNITIES } from "../data";
import { fadeUp, stagger } from "../animations";

const Opportunities = () => (
  <motion.section
    className="lp-section lp-section-alt"
    id="opportunities"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    variants={stagger}
  >
    <div className="lp-container">
      <motion.div className="lp-section-hd" variants={fadeUp}>
        <span className="lp-section-label">Career Opportunities</span>
        <h2>Opportunities That Match Your Ambition</h2>
        <p>Browse roles from companies and organizations actively looking for talent like yours.</p>
      </motion.div>
      <div className="lp-opp-grid">
        {OPPORTUNITIES.map(o => (
          <motion.div key={o.role} className="lp-opp-card" variants={fadeUp}>
            <div className="lp-opp-header">
              <div className="lp-opp-logo" style={{ background: o.color + "18", color: o.color }}>
                <FiBriefcase size={18} />
              </div>
              <span className="lp-opp-type" style={{ background: o.color + "18", color: o.color }}>
                {o.type}
              </span>
            </div>
            <h4 className="lp-opp-role">{o.role}</h4>
            <p className="lp-opp-company">{o.company}</p>
            <p className="lp-opp-loc"><FiMapPin size={12} /> {o.location} · {o.type}</p>
            <div className="lp-opp-skills">
              {o.skills.map(s => <span key={s} className="lp-skill-chip">{s}</span>)}
            </div>
            <Link to="/signup" className="lp-opp-btn">
              View Opportunity <FiArrowRight size={13} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Opportunities;
