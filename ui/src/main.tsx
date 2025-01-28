import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import "./globals.css";
import TeamsPage from "./routes/Teams.tsx";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

const theme = createTheme({ palette: { mode: "dark" } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<App />}>
              <Route index element={<div></div>} />
              <Route path="teams" element={<TeamsPage />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>
);
