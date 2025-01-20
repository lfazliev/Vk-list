import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RepositoryStore } from "./stores/RepositoryStore";
import { createContext } from "react";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const store = new RepositoryStore();
export const StoreContext = createContext(store);

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

if (document.getElementById("root")) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <StoreContext.Provider value={store}>
          <App />
        </StoreContext.Provider>
      </ThemeProvider>
    </StrictMode>,
  );
}
