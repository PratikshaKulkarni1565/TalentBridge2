import React, { useMemo } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from "recharts";

const SKILL_LEVELS = {
  react: 90, javascript: 85, typescript: 75, "node.js": 80, nodejs: 80,
  python: 70, mongodb: 72, sql: 65, aws: 60, docker: 55,
  java: 68, css: 78, html: 82, graphql: 58, redux: 72,
};

const getLevel = (skill) =>
  SKILL_LEVELS[skill.toLowerCase()] ?? Math.floor(Math.random() * 30 + 55);

const SkillChart = ({ skills }) => {
  const data = useMemo(
    () => skills.slice(0, 7).map((s) => ({ skill: s, level: getLevel(s) })),
    [skills]
  );

  if (!skills?.length) return null;

  return (
    <div className="skill-chart-wrapper">
      <h3>Skill Overview</h3>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="var(--tb-border)" />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--tb-text)", fontSize: 12 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Level"
            dataKey="level"
            stroke="var(--tb-teal)"
            fill="var(--tb-teal)"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{ background: "var(--tb-card)", border: "1px solid var(--tb-border)", borderRadius: 8 }}
            formatter={(v) => [`${v}%`, "Proficiency"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillChart;
