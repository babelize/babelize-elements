import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
    // PhoneInput renders the full ~244-country dropdown; under load a single
    // interaction can approach the 5s default, so give the suite headroom.
    testTimeout: 10000,
  },
});
