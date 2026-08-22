import React from "react";
import { motion } from "framer-motion";
import { STEPS } from "../data";
import { fadeUp, stagger } from "../animations";

const HowItWorks = () => (
  <motion.section
    className="lp-section lp-section-alt"
    id="how-it-works"
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.15 }}
    variants={stagger}
  >
    <div className="lp-container">
      <motion.div className="lp-section-hd" variants={fadeUp}>
        <span className="lp-section-label">How It Works</span>
        <h2>Get Started in Minutes</h2>
        <p>Build your professional presence and start discovering opportunities.</p>
      </motion.div>
      <div className="lp-steps-row">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.num}>
            <motion.div className="lp-step" variants={fadeUp}>
              <div className="lp-step-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </motion.div>
            {i < STEPS.length - 1 && <div className="lp-step-connector" aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </motion.section>
);

export default HowItWorks;
