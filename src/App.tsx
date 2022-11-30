import { CSSReset, ThemeProvider } from "@stacks/ui";
import { loadFonts } from "@utils/load-fonts";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Connect } from "@stacks/connect-react";

import "./App.css";

export function App() {
  const navigate = useNavigate();
  useEffect(() => void loadFonts(), []);

  return (
    <ThemeProvider>
      <Connect
        authOptions={{
          manifestPath: "manifest.json",
          appDetails: {
            name: "Stacking on the web",
            icon: "http://placekitten.com/200/200",
          },
          onFinish: () => navigate("/choose-stacking"),
        }}
      >
        {CSSReset}
        <Outlet />
      </Connect>
    </ThemeProvider>
  );
}
