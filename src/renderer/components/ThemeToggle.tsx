import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import { MdOutlineLaptopChromebook } from "react-icons/md";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  // Detectar primera carga
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
    } else {
      // Primera vez → light
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  }, []);

  // Listener para cambios del sistema (solo si está en "system")
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applySystemTheme = () => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", media.matches);
      }
    };

    media.addEventListener("change", applySystemTheme);
    applySystemTheme();

    return () => media.removeEventListener("change", applySystemTheme);
  }, [theme]);

  // Aplicar cambios de theme (excepto system que se maneja aparte)
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Rotar entre las opciones
  const cycleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  return (
    <button
      onClick={cycleTheme}
      className="fixed top-4 right-4 p-3 rounded-full 
                 bg-background border border-neutral-gray/20 text-neutral-dark 
                 hover:bg-neutral-dark hover:text-neutral-light
                 transition-colors duration-500 ease-in-out z-50 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "light" && <FaMoon />}
      {theme === "dark" && <FaSun />}
      {theme === "system" && <MdOutlineLaptopChromebook />}
    </button>
  );
}
