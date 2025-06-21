import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // this loads .env variables

  return {
    plugins: [react(), tailwindcss()],
    // Vite's server.proxy is only used during local development (i.e. when running npm run dev).
    // It's useful to redirect /api to your backend (to avoid CORS issues locally).
    // But in production, Vite builds static files, and this proxy is ignored.
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_BACKEND_URL, // now it works!
    //       changeOrigin: true,
    //       secure: true, // true in production
    //     },
    //   },
    // },
 };  // I commented out this one in production
});
