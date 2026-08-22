import React, { useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import ProfileShowcase from "./components/ProfileShowcase";
import Opportunities from "./components/Opportunities";
import Community from "./components/Community";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import "./landing.css";

const Landing = () => {
  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="lp-root">
      <Navbar onScrollTo={scrollTo} />
      <Hero onScrollTo={scrollTo} />
      <Stats />
      <Features />
      <HowItWorks />
      <ProfileShowcase />
      <Opportunities />
      <Community />
      <FinalCTA onScrollTo={scrollTo} />
      <Footer onScrollTo={scrollTo} />
    </div>
  );
};

export default Landing;
