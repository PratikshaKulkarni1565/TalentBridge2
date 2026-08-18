import { useEffect } from "react";

const useKeyboardShortcuts = ({ onNewPost, onSearch, onCommandPalette, onEsc }) => {
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onCommandPalette?.();
        return;
      }

      if (e.key === "Escape") {
        onEsc?.();
        return;
      }

      if (isTyping) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        onNewPost?.();
      }

      if (e.key === "/") {
        e.preventDefault();
        onSearch?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewPost, onSearch, onCommandPalette, onEsc]);
};

export default useKeyboardShortcuts;
