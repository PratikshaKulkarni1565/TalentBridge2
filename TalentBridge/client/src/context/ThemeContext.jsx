import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

const ACCENT_COLORS = {
  teal:   { "--tb-teal": "#00A896", "--tb-teal-dark": "#028090" },
  blue:   { "--tb-teal": "#2563EB", "--tb-teal-dark": "#1D4ED8" },
  green:  { "--tb-teal": "#16A34A", "--tb-teal-dark": "#15803D" },
  purple: { "--tb-teal": "#7C3AED", "--tb-teal-dark": "#6D28D9" },
  orange: { "--tb-teal": "#EA580C", "--tb-teal-dark": "#C2410C" },
};

const applyTheme = (mode, accent) => {
  const root = document.documentElement;
  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.style.setProperty("--tb-bg", "#0F172A");
    root.style.setProperty("--tb-card", "#1E293B");
    root.style.setProperty("--tb-border", "#334155");
    root.style.setProperty("--tb-text", "#E2E8F0");
    root.style.setProperty("--tb-muted", "#94A3B8");
    root.style.setProperty("--tb-navy", "#1E293B");
    root.style.setProperty("--tb-navy-dark", "#0F172A");
  } else {
    root.style.setProperty("--tb-bg", "#F4F6F8");
    root.style.setProperty("--tb-card", "#FFFFFF");
    root.style.setProperty("--tb-border", "#E1E6EA");
    root.style.setProperty("--tb-text", "#172B3A");
    root.style.setProperty("--tb-muted", "#64748B");
    root.style.setProperty("--tb-navy", "#0F3057");
    root.style.setProperty("--tb-navy-dark", "#0A2342");
  }

  const colors = ACCENT_COLORS[accent] || ACCENT_COLORS.teal;
  Object.entries(colors).forEach(([k, v]) => root.style.setProperty(k, v));
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem("tb_theme_mode") || "light");
  const [accent, setAccent] = useState(() => localStorage.getItem("tb_theme_accent") || "teal");

  useEffect(() => {
    applyTheme(mode, accent);
    localStorage.setItem("tb_theme_mode", mode);
    localStorage.setItem("tb_theme_accent", accent);
  }, [mode, accent]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system", accent);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode, accent]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, accent, setAccent, ACCENT_COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
