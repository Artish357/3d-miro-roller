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
      <div className="footer">
        Running locally. <br></br>
        Also available as a{" "}
        <a href="https://miro.com/app-install/?response_type=code&client_id=3458764596685017565&redirect_uri=%2Fapp-install%2Fconfirm%2F">
          miro plugin
        </a>{" "}
        with shared rolls
      </div>
    </LocalContextProvider>,
  );
}
