import { createRoot } from "react-dom/client";
import * as React from "react";
import { App } from "./app";
import { LocalContextProvider } from "./rollerContexts/local";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <LocalContextProvider>
      <App />
    </LocalContextProvider>
  );
}
