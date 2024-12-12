export default [
  {
    languageOptions: {
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: {
      react: (await import("eslint-plugin-react")).default,
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin"))
        .default,
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "react/prop-types": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  (await import("eslint-plugin-react/configs/recommended")).default,
  (await import("@typescript-eslint/eslint-plugin/dist/configs/recommended"))
    .default,
];
