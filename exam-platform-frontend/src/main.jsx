import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AppProviders } from "./app/AppProviders";
import { ThemeProviderContext } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ExamProvider } from "./contexts/ExamContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProviderContext>
        <AppProviders>
          <AuthProvider>
            <ExamProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </ExamProvider>
          </AuthProvider>
        </AppProviders>
      </ThemeProviderContext>
    </BrowserRouter>
  </React.StrictMode>
);