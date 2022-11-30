import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import polyfillNode from "rollup-plugin-polyfill-node";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    polyfillNode(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
    }),
  ],
  define: {
    CONFIG: "''",
    process: "''",
    global: "globalThis",
  },
  resolve: {
    alias: {
      stream: "vite-compatible-readable-stream",
    },
  },
});
