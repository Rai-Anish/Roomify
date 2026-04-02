import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier"; 

export default [
  {
    // Ensure ESLint doesn't try to lint your compiled JS or dependencies
    ignores: ["node_modules", "dist", "*.config.ts"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_", 
        varsIgnorePattern: "^_" 
      }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off",
      "no-console": "off", // Usually preferred for server logging
    },
  },
  eslintConfigPrettier, // Must be last!
];
