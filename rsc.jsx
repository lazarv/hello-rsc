import { renderToReadableStream } from "react-server-dom-webpack/server.edge";
import * as OS from "node:os";

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function App() {
  await delay(500);
  return (
    <>
      <h1>Hello World!</h1>
      <h2>
        {OS.type()} {OS.arch()} {OS.release()}
      </h2>
      {new Date().toISOString()}
    </>
  );
}

export async function render() {
  return renderToReadableStream(<App />);
}
