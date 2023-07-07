import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client.browser";

let rsc = null;
function App() {
  if (!rsc) {
    rsc = createFromFetch(
      fetch("/app", {
        headers: {
          Accept: "text/x-component",
        },
      })
    );
  }

  return rsc;
}

const root = createRoot(document.getElementById("root"));
root.render(
  <Suspense fallback="Loading...">
    <App />
  </Suspense>
);
