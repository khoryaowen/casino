import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["**/dist/**", "**/node_modules/**", "pnpm-lock.yaml"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["packages/client/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["packages/server/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  eslintConfigPrettier,
);
