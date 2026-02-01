import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "www.halalhaven.kr",
      "halalhaven.kr",
      "www.halalhave.kr",
      "halalhave.kr",
      "localhost",
      "127.0.0.1",
    ],
    watch: {
      usePolling: true,
    },
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  },
});
