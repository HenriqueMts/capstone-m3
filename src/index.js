import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider";
import { UserProvider } from "./providers/User";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
try {
  root.render(
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <React.StrictMode>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </React.StrictMode>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  );
} catch (err) {
  // If a module throws during render or initialization, show the error on the page
  console.error("Render error:", err);
  document.body.innerHTML = `<div style="padding:40px;font-family:sans-serif"><h1>Erro ao iniciar a aplicação</h1><pre style="white-space:pre-wrap;color:#b00020">${
    (err && err.stack) || err
  }</pre></div>`;
}
