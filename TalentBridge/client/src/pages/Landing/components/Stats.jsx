import React from "react";
import { motion } from "framer-motion";
import { STATS } from "../data";
import { fadeUp, stagger } from "../animations";

const Stats = () => (
  <div className="lp-stats-wrap">
    <motion.section
      className="lp-stats-bar"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={stagger}
    >
      {STATS.map(s => (
        <motion.div key={s.lbl} className="lp-stat" variants={fadeUp}>
          <span className="lp-stat-val">{s.val}</span>
          <span className="lp-stat-lbl">{s.lbl}</span>
        </motion.div>
      ))}
    </motion.section>
  </div>
);

export default Stats;
