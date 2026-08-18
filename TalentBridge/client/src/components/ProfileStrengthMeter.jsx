import React, { useMemo } from "react";
import { motion } from "framer-motion";

const checks = [
  { key: "name",       label: "Add your name",        test: (p) => !!p?.name },
  { key: "headline",   label: "Add a headline",        test: (p) => !!p?.headline },
  { key: "about",      label: "Add an About section",  test: (p) => !!p?.about },
  { key: "location",   label: "Add your location",     test: (p) => !!p?.location },
  { key: "skills",     label: "Add skills",            test: (p) => p?.skills?.length > 0 },
  { key: "picture",    label: "Upload a profile photo",test: (p) => !!p?.profilePicture },
  { key: "cover",      label: "Add a cover photo",     test: (p) => !!p?.coverPicture },
];

const ProfileStrengthMeter = ({ profile }) => {
  const passed = useMemo(() => checks.filter((c) => c.test(profile)), [profile]);
  const pct = Math.round((passed.length / checks.length) * 100);

  const color = pct >= 80 ? "#16A34A" : pct >= 50 ? "var(--tb-teal)" : "#EA580C";

  return (
    <div className="strength-card">
      <div className="strength-header">
        <span>Profile Strength</span>
        <strong style={{ color }}>{pct}%</strong>
      </div>
      <div className="strength-track">
        <motion.div
          className="strength-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="strength-checks">
        {checks.map((c) => {
          const done = c.test(profile);
          return (
            <div key={c.key} className={`strength-item ${done ? "done" : ""}`}>
              <span>{done ? "✔" : "○"}</span>
              <span>{c.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileStrengthMeter;
