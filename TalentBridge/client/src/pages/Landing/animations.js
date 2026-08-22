export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

export const floatAnim = {
  y: [0, -10, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

export const floatAnimSlow = {
  y: [0, 8, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
};
