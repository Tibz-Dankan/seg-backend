import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/routes/**/*.test.ts"],
    // threads: false,
    setupFiles: ["src/test/setup.ts"],
  },
  resolve: {
    alias: {
      auth: "/src/auth",
      quotes: "/src/quotes",
      lib: "/src/lib",
    },
  },
});
