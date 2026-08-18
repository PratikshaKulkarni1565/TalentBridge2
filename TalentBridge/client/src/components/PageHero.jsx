import React from "react";
import { motion } from "framer-motion";

const PageHero = ({ image, title, subtitle, height = 220 }) => (
  <div className="page-hero" style={{ height, backgroundImage: `url(${image})` }}>
    <div className="page-hero-overlay" />
    <motion.div
      className="page-hero-text"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </motion.div>
  </div>
);

export default PageHero;
