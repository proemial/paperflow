"use client";
import { useColorScheme } from "@mui/joy/styles";
import { useEffect } from "react";

export default function useAutoColorScheme() {
  const { setMode } = useColorScheme();

  useEffect(() => {
    const query = '(prefers-color-scheme: dark)';
    // Add listener to update styles
    window.matchMedia(query).addEventListener('change', e =>
      setMode(e.matches ? 'dark' : 'light')
    );

    // Setup dark/light mode for the first time
    setMode(window.matchMedia(query).matches ? 'dark' : 'light')

    // Remove listener
    return () => {
      window.matchMedia(query).removeEventListener('change', () => { });
    }
  }, [setMode]);
}