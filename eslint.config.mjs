import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React Compiler-oriented rule: flags every setState-in-effect, including the
      // standard "hydrate from localStorage on mount" / "reset form when a sheet opens"
      // patterns used throughout this app. Those are already guarded (mount-only deps,
      // `hydrated` flags before render) so we keep the signal as a warning rather than
      // rewriting idiomatic effects around it.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
