"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { usePathname } from "next/navigation";
import { themes } from "@/lib/themes";

type ThemeContextValue = {
  active: number;
  theme: (typeof themes)[number];
  isLight: boolean;
  nextTheme: () => void;
  previousTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [active, setActive] = useState(0);

  const isHome = pathname === "/";
  const theme = isHome ? themes[active] : themes[1];
  const isLight = theme.name === "Ivory";

  const nextTheme = () => {
    setActive((current) => (current + 1) % themes.length);
  };

  const previousTheme = () => {
    setActive(
      (current) => (current - 1 + themes.length) % themes.length,
    );
  };

  useEffect(() => {
    if (!isHome) return;

    const interval = setInterval(() => {
      setActive((current) => (current + 1) % themes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isHome]);

  return (
    <ThemeContext.Provider
      value={{
        active,
        theme,
        isLight,
        nextTheme,
        previousTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}