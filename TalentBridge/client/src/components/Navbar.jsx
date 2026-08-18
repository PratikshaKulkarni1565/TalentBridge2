import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiUsers, FiSearch, FiMessageSquare,
  FiBell, FiSettings, FiBriefcase, FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch {}
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user, fetchUnread]);

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!user) return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/landing" className="navbar-brand">TalentBridge</Link>
      <div className="navbar-links">
        <Link to="/login"  className="landing-nav-signin">Sign In</Link>
        <Link to="/signup" className="landing-nav-signup">Get Started</Link>
      </div>
    </nav>
  );

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-brand" aria-label="TalentBridge home">TalentBridge</Link>
      <div className="navbar-links">
        <Link to="/"             title="Home"          aria-label="Home"><FiHome /></Link>
        <Link to="/search"       title="Search"        aria-label="Search"><FiSearch /></Link>
        <Link to="/connections"  title="Connections"   aria-label="Connections"><FiUsers /></Link>
        <Link to="/jobs"         title="Jobs"          aria-label="Jobs"><FiBriefcase /></Link>
        <Link to="/messages"     title="Messages"      aria-label="Messages"><FiMessageSquare /></Link>

        <Link to="/notifications" title="Notifications" aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`} className="notif-link">
          <FiBell />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                className="navbar-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                aria-live="polite"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <Link to="/settings" title="Settings" aria-label="Settings"><FiSettings /></Link>
        <Link to={`/profile/${user._id}`} className="navbar-avatar" title="My Profile" aria-label="My Profile">
          <img
            src={user.profilePicture
              ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${user.profilePicture}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=00A896&color=fff&size=32`}
            alt={`${user.name}'s avatar`}
          />
        </Link>
        <button onClick={handleLogout} title="Logout" className="logout-btn" aria-label="Log out">
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
