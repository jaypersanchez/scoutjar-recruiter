import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const configs = {
  languageOptions: {
    ecmaVersion: 2020,
    globals: { ...globals.browser, ...globals.node },
  },
  plugins: {
    react,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  settings: { react: { version: "19" } },
  rules: {
    ...js.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    "no-unused-vars": ["error"],
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
};

export default [
  { ignores: ["dist", "eslint.config.js"] },

  // Configuration for JSX files
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ...configs.languageOptions,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: configs.plugins,
    settings: configs.settings,
    rules: configs.rules,
  },

  // Configuration for TSX files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ...configs.languageOptions,
    },
    plugins: { ...configs.plugins, "@typescript-eslint": tsEslint },
    settings: configs.settings,
    rules: {
      ...tsEslint.configs.recommended.rules,
      ...configs.rules,
      "@typescript-eslint/no-unused-vars": ["error"],
    },
  },
];
