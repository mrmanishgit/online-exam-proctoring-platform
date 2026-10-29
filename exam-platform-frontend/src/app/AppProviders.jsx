import { useMemo } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useCustomTheme } from "../contexts/ThemeContext";

export function AppProviders({ children }) {
  const { mode } = useCustomTheme();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#4F46E5",
            light: "#818CF8",
            dark: "#3730A3",
          },
          secondary: { main: "#0EA5E9" },
          success: { main: "#16A34A" },
          warning: { main: "#D97706" },
          error: { main: "#DC2626" },
          background: {
            default: mode === "light" ? "#F8FAFC" : "#0B1120",
            paper: mode === "light" ? "#FFFFFF" : "#111827",
          },
          text: {
            primary: mode === "light" ? "#0F172A" : "#F8FAFC",
            secondary: mode === "light" ? "#64748B" : "#CBD5E1",
          },
          divider: mode === "light" ? "#E2E8F0" : "#334155",
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
          h1: { fontWeight: 800, letterSpacing: "-0.04em" },
          h2: { fontWeight: 800, letterSpacing: "-0.035em" },
          h3: { fontWeight: 750, letterSpacing: "-0.03em" },
          h4: { fontWeight: 750, letterSpacing: "-0.025em" },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 700 },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: "10px 18px",
                boxShadow: "none",
              },
              containedPrimary: {
                "&:hover": { boxShadow: "0 8px 20px rgba(79,70,229,.22)" },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                boxShadow: "0 8px 30px rgba(15,23,42,.06)",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              rounded: { borderRadius: 16 },
            },
          },
          MuiTextField: {
            defaultProps: { fullWidth: true, size: "medium" },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}