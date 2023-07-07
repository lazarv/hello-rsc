import { createMiddleware } from "@hattip/adapter-node";
import { createServer as createViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";

const viteDevServer = await createViteDevServer({
  server: {
    middlewareMode: true,
  },
  appType: "ssr",
  plugins: [react()],
});

const html = await readFile("./index.html", "utf-8");
const ssr = createMiddleware(async ({ request }) => {
  if (request.headers.get("accept").includes("text/x-component")) {
    try {
      const { render } = await viteDevServer.ssrLoadModule("./rsc.jsx");
      return new Response(await render(), {
        headers: {
          "content-type": "text/x-component",
        },
      });
    } catch (e) {
      return new Response(e.stack, {
        status: 500,
        headers: {
          "content-type": "text/plain",
        },
      });
    }
  }
  return new Response(
    await viteDevServer.transformIndexHtml(request.url, html),
    {
      headers: {
        "content-type": "text/html",
      },
    }
  );
});

viteDevServer.middlewares.use(ssr);
viteDevServer.middlewares.listen(3000).on("listening", () => {
  console.log("Listening on http://localhost:3000");
});
