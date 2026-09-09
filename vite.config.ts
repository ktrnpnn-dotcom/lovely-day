import path from "node:path";
import { fileURLToPath } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const here = path.dirname(fileURLToPath(import.meta.url));

const STREAMS: Record<string, string[]> = {
  deepspace: [
    "https://ice5.somafm.com/deepspaceone-128-mp3",
    "https://ice6.somafm.com/deepspaceone-128-mp3",
    "https://ice2.somafm.com/deepspaceone-128-mp3",
  ],
  dronezone: [
    "https://ice5.somafm.com/dronezone-128-mp3",
    "https://ice6.somafm.com/dronezone-128-mp3",
  ],
  spacestation: [
    "https://ice5.somafm.com/spacestation-128-mp3",
    "https://ice6.somafm.com/spacestation-128-mp3",
  ],
};

async function handleRadio(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  const url = req.url ?? "";
  const match = url.match(/^\/api\/radio\/([^/?#]+)/);
  if (!match) {
    next();
    return;
  }

  const urls = STREAMS[match[1]];
  if (!urls) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Unknown station" }));
    return;
  }

  let lastError = "Stream unavailable";
  for (const streamUrl of urls) {
    try {
      const upstream = await fetch(streamUrl, {
        cache: "no-store",
        headers: {
          "User-Agent": "LovelyDay/1.0 (personal player)",
          Accept: "audio/mpeg,audio/*;q=0.9,*/*;q=0.1",
          "Icy-MetaData": "0",
        },
        redirect: "follow",
      });
      if (!upstream.ok || !upstream.body) {
        lastError = `HTTP ${upstream.status}`;
        continue;
      }

      res.statusCode = 200;
      res.setHeader(
        "Content-Type",
        upstream.headers.get("content-type") || "audio/mpeg",
      );
      res.setHeader("Cache-Control", "no-store");

      const reader = upstream.body.getReader();
      const abort = () => {
        void reader.cancel().catch(() => undefined);
      };
      req.on("close", abort);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;
        if (!res.write(Buffer.from(value))) {
          await new Promise<void>((resolve) => res.once("drain", resolve));
        }
      }
      res.end();
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "fetch failed";
    }
  }

  if (!res.headersSent) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: lastError }));
  }
}

function radioProxy(): Plugin {
  return {
    name: "somafm-radio-proxy",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleRadio(req, res, next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleRadio(req, res, next);
      });
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss(), radioProxy()],
  resolve: {
    alias: {
      "@": path.resolve(here, "src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 43147,
    strictPort: true,
    watch: {
      ignored: ["**/public/audio/**"],
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 43147,
  },
});
