import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

export const envPath = path.resolve(process.cwd(), "..", "..");

export default defineConfig(({ mode }) => {
  const { APP_URL, FILE_UPLOAD_SIZE_LIMIT, DRAWIO_URL, COLLAB_URL } = loadEnv(
    mode,
    envPath,
    "",
  );

  return {
    define: {
      "process.env": {
        APP_URL,
        FILE_UPLOAD_SIZE_LIMIT,
        DRAWIO_URL,
        COLLAB_URL,
      },
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Increase the limit to 5MB (or your desired size)
        },
        manifest: {
          name: 'Docmost',
          short_name: 'Docmost',
          description: 'Open-source collaborative wiki and documentation software',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: APP_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
