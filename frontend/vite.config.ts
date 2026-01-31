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
      "mediport.azbek.me",
      "152.42.238.178",
    ],
    watch: {
      usePolling: true,
    },
  },
});
