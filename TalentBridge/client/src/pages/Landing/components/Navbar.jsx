import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { NAV_LINKS } from "../data";

const Navbar = ({ onScrollTo }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id) => {
    setMenuOpen(false);
    onScrollTo(id);
  };

  return (
    <header className={`lp-nav${scrolled ? " scrolled" : ""}`}>
      <div className="lp-container lp-nav-inner">
        <Link to="/landing" className="lp-brand">
          <span className="lp-brand-talent">Talent</span>
          <span className="lp-brand-bridge">Bridge</span>
        </Link>

        <nav className="lp-nav-links">
          {NAV_LINKS.map(({ label, id }) => (
            <button key={id} className="lp-nav-link" onClick={() => handleNav(id)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn-ghost">Log In</Link>
          <Link to="/signup" className="lp-btn-primary">Get Started</Link>
        </div>

        <button
          className="lp-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lp-mobile-menu open"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            {NAV_LINKS.map(({ label, id }) => (
              <button key={id} className="lp-mobile-link" onClick={() => handleNav(id)}>
                {label}
              </button>
            ))}
            <div className="lp-mobile-auth">
              <Link to="/login" className="lp-btn-ghost" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="lp-btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
