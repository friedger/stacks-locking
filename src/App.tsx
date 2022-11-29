import { CSSReset, ThemeProvider } from "@stacks/ui";
import { loadFonts } from "@utils/load-fonts";
import { useEffect, useState } from "react";

import "./App.css";
import { ChooseStackingMethod } from "./pages/start-stacking/start-stacking";

export function App() {
  useEffect(() => void loadFonts(), []);

  return (
    <ThemeProvider>
      <ChooseStackingMethod />
      {CSSReset}
    </ThemeProvider>
  );
}
