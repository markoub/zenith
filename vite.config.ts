/// <reference types="vitest" />
import { defineConfig } from "vite";

// `base: "./"` keeps asset paths relative so the build works when served
// from a GitHub Pages project sub-path (https://user.github.io/<repo>/).
export default defineConfig({
  base: "./",
  test: {
    environment: "node",
    globals: true,
  },
});
