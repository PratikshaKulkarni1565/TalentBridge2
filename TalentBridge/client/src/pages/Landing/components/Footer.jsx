import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { FOOTER_LINKS } from "../data";

const Footer = ({ onScrollTo }) => (
  <footer className="lp-footer">
    <div className="lp-container">
      <div className="lp-footer-top">
        <div className="lp-footer-brand-col">
          <span className="lp-brand lp-footer-logo">
            <span className="lp-brand-talent">Talent</span>
            <span className="lp-brand-bridge">Bridge</span>
          </span>
          <p className="lp-footer-tagline">Connect · Grow · Succeed</p>
          <p className="lp-footer-desc">
            A professional networking platform that helps people connect, showcase skills, and discover career opportunities.
          </p>
          <div className="lp-footer-social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin size={16} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FiGithub size={16} />
            </a>
          </div>
        </div>

        <div className="lp-footer-col">
          <p className="lp-footer-col-title">Product</p>
          {FOOTER_LINKS.product.map(({ label, id }) => (
            <button key={label} type="button" className="lp-footer-link" onClick={() => onScrollTo(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="lp-footer-col">
          <p className="lp-footer-col-title">Community</p>
          {FOOTER_LINKS.community.map(({ label, id }) => (
            <button key={label} type="button" className="lp-footer-link" onClick={() => onScrollTo(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="lp-footer-col">
          <p className="lp-footer-col-title">Company</p>
          {FOOTER_LINKS.company.map(({ label, href }) => (
            <a key={label} href={href} className="lp-footer-link">{label}</a>
          ))}
        </div>
      </div>

      <div className="lp-footer-bottom">
        <p>&copy; {new Date().getFullYear()} TalentBridge. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
