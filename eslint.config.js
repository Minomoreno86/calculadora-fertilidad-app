import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigAsPlugin } from "@eslint/compat";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.browser,
    },
    plugins: {
      typescript: tseslint.plugin,
      react: fixupConfigAsPlugin(pluginReactConfig),
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      // Tus reglas personalizadas aquí
      "react/react-in-jsx-scope": "off", // Para React 17+
      "@typescript-eslint/explicit-module-boundary-types": "off", // Puedes habilitarlo si quieres tipos explícitos
    },
  },
];
