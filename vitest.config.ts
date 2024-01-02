import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/routes/**/*.test.ts"],
    setupFiles: ["src/test/setup.ts"],
  },
  resolve: {
    alias: {
      auth: "/src/routes/auth",
      token: "/src/routes/token",
    },
  },
});
