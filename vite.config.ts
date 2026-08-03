import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const marrone = (env.MARRONE_API_URL || "http://127.0.0.1:5000").replace(
    /\/$/,
    ""
  );
  const key =
    env.TERESA_INTEGRATION_KEY ||
    env.CONECTA_INTEGRATION_KEY ||
    env.MARRONE_INTEGRATION_KEY ||
    "";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/orcamento": {
          target: marrone,
          changeOrigin: true,
          rewrite: () => "/api/integracao/propostas-eleitorais/lead",
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (key) proxyReq.setHeader("X-Integracao-Key", key);
            });
          },
        },
      },
    },
  };
});
