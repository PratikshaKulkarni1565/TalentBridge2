import React, { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiSearch, FiBriefcase, FiUsers, FiBell, FiSettings, FiUser, FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const COMMANDS = [
  { id: "home",          label: "Go to Home",         icon: <FiHome />,     path: "/" },
  { id: "search",        label: "Search People",       icon: <FiSearch />,   path: "/search" },
  { id: "jobs",          label: "Browse Jobs",         icon: <FiBriefcase />,path: "/jobs" },
  { id: "connections",   label: "My Connections",      icon: <FiUsers />,    path: "/connections" },
  { id: "notifications", label: "Notifications",       icon: <FiBell />,     path: "/notifications" },
  { id: "settings",      label: "Settings & Theme",    icon: <FiSettings />, path: "/settings" },
];

const CommandPalette = ({ open, onClose, onNewPost }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const allCommands = [
    ...COMMANDS,
    { id: "profile", label: "My Profile", icon: <FiUser />, path: `/profile/${user?._id}` },
    { id: "newpost", label: "Create New Post", icon: <FiEdit />, action: () => { onNewPost?.(); onClose(); } },
  ];

  const run = useCallback((cmd) => {
    if (cmd.action) { cmd.action(); return; }
    navigate(cmd.path);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cmd-wrapper"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.12 } }}
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="cmd-root" label="Command Palette">
              <div className="cmd-input-wrapper">
                <FiSearch className="cmd-search-icon" />
                <Command.Input
                  className="cmd-input"
                  placeholder="Search commands..."
                  value={search}
                  onValueChange={setSearch}
                  autoFocus
                />
                <kbd className="cmd-esc" onClick={onClose}>ESC</kbd>
              </div>
              <Command.List className="cmd-list">
                <Command.Empty className="cmd-empty">No commands found.</Command.Empty>
                <Command.Group heading="Navigation" className="cmd-group">
                  {allCommands.map((cmd) => (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => run(cmd)}
                      className="cmd-item"
                    >
                      <span className="cmd-item-icon">{cmd.icon}</span>
                      {cmd.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
