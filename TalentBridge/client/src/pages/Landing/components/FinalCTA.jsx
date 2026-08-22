import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const FinalCTA = ({ onScrollTo }) => (
  <motion.section
    className="lp-cta-section"
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="lp-cta-decor-1" aria-hidden="true" />
    <div className="lp-cta-decor-2" aria-hidden="true" />
    <div className="lp-container lp-cta-inner">
      <h2>Your Next Opportunity Is Closer Than You Think.</h2>
      <p>Build your network. Showcase your skills. Discover what&apos;s next.</p>
      <div className="lp-cta-btns">
        <Link to="/signup" className="lp-btn-white lp-btn-lg">
          Create Your Profile <FiArrowRight size={16} />
        </Link>
        <button type="button" className="lp-btn-white-outline lp-btn-lg" onClick={() => onScrollTo("opportunities")}>
          Explore Opportunities
        </button>
      </div>
    </div>
  </motion.section>
);

export default FinalCTA;
