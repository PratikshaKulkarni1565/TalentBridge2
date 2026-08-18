import React from "react";
import { motion } from "framer-motion";

const variants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.18 } },
};

const PageTransition = ({ children }) => (
  <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

export default PageTransition;
