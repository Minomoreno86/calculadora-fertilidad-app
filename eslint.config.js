import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  // Base configuration for all files
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      // Common rules for all files
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
  // Configuration for React files
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      // React specific rules
      "react/react-in-jsx-scope": "off", // Not needed for React 17+
      "react/jsx-uses-react": "off", // Not needed for React 17+
      "react/prop-types": "off", // Use TypeScript for prop-types
    },
  },
  // Configuration for Jest test files
  {
    files: ["**/*.test.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      // Jest specific rules
      "no-undef": "off", // Jest globals are defined
    },
  },
  // Configuration for Node.js utility files
  {
    files: ["*.js", "*.cjs"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
];