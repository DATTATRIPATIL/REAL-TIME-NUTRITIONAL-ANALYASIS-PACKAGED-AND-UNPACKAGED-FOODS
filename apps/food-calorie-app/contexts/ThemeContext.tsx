import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme, Platform } from "react-native";

type ThemeMode = "light" | "dark" | "auto" | "reading";

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: "light" | "dark" | "reading";
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app_theme_mode";

let themeStorage: { [key: string]: string } = {};

const getStorageItem = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch {
      return themeStorage[key] || null;
    }
  }

  return themeStorage[key] || null;
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  themeStorage[key] = value;

  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors.
    }
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();

  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getStorageItem(THEME_STORAGE_KEY);

        if (
          savedTheme === "light" ||
          savedTheme === "dark" ||
          savedTheme === "auto" ||
          savedTheme === "reading"
        ) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const currentTheme: "light" | "dark" | "reading" =
    themeMode === "reading"
      ? "reading"
      : themeMode === "dark"
        ? "dark"
        : themeMode === "light"
          ? "light"
          : systemColorScheme === "dark"
            ? "dark"
            : "light";

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await setStorageItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ themeMode, currentTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
