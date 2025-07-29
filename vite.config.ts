/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild, command }) => {
  const isTest = command === 'test';
  
  return {
    build: {
      rollupOptions: isSsrBuild
        ? {
            input: "./server/app.ts",
          }
        : undefined,
    },
    server: {
      hmr: {
        port: 0, // Deixa o Vite escolher uma porta livre automaticamente
      },
    },
    plugins: isTest 
      ? [react(), tailwindcss(), tsconfigPaths()] 
      : [tailwindcss(), reactRouter(), tsconfigPaths()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './app/tests/setup.ts',
      include: ['app/**/*.{test,spec}.{ts,tsx}'],
    },
  };
});
