import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { BrowserRouter, Route, Routes } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

import ExpensesPage from "@/pages/expenses/index.tsx"
import WordsPage from "@/pages/words/index.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<App />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/words" element={<WordsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
