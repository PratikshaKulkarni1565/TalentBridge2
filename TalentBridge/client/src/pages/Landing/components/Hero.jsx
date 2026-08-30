import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { fadeUp, stagger } from "../animations";
import HeroVisual from "./HeroVisual";

const Hero = ({ onScrollTo }) => (
  <section className="lp-hero">
    <div className="lp-hero-inner">
      <motion.div className="lp-hero-left" variants={stagger} initial="hidden" animate="show">
        <motion.span className="lp-badge" variants={fadeUp}>
          Connect · Grow · Succeed
        </motion.span>
        <motion.h1 className="lp-hero-h1" variants={fadeUp}>
          Build Your <span className="lp-accent">Professional Network.</span>{" "}
          Discover Your <span className="lp-accent">Next Opportunity.</span>
        </motion.h1>
        <motion.p className="lp-hero-sub" variants={fadeUp}>
          TalentBridge connects students, professionals, recruiters, and organizations in one platform where opportunities, skills, and meaningful professional connections come together.
        </motion.p>
        <motion.div className="lp-hero-btns" variants={fadeUp}>
          <Link to="/signup" className="lp-btn-primary lp-btn-lg">
            Get Started <FiArrowRight size={16} />
          </Link>
          <button type="button" className="lp-btn-outline lp-btn-lg" onClick={() => onScrollTo("opportunities")}>
            Explore Opportunities
          </button>
        </motion.div>
        <motion.p className="lp-hero-trust" variants={fadeUp}>
          <span>Built for students</span>
          <span aria-hidden="true">·</span>
          <span>professionals</span>
          <span aria-hidden="true">·</span>
          <span>growing teams</span>
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
);

export default Hero;
