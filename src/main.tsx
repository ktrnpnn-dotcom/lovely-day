import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LovelyDayApp } from "@/components/player/LovelyDayApp";
import "./index.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Не найден #root");
}

createRoot(root).render(
  <StrictMode>
    <LovelyDayApp />
  </StrictMode>,
);
