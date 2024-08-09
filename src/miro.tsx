import { createRoot } from "react-dom/client";
import * as React from 'react'
import { MiroContextProvider } from "./rollerContexts/miro";
import { App } from "./app";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <MiroContextProvider>
      <App />
    </MiroContextProvider>
  );
}
