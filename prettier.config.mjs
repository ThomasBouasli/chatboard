/**
 * @type {import('prettier').Config & import("@ianvs/prettier-plugin-sort-imports").PrettierConfig}
 */
const config = {
  arrowParens: "always",
  printWidth: 120,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: [
    "<TYPES>",
    "<TYPES>^[.]",
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
    "",
    "<BUILTIN_MODULES>", // Node.js built-in modules
    "<THIRD_PARTY_MODULES>", // Imports not matched by other special words or groups.
    "",
    "@/(.*)$", // @/ paths
    "^./(.*)",
    "^../(.*)",
  ],
};

export default config;
