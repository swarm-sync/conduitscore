import path from "path";
import { fileURLToPath } from "url";

// Must match the app root (where node_modules/tailwindcss lives). Without this,
// PostCSS can resolve @import "tailwindcss" from a parent folder that has a
// stray package.json but no node_modules (e.g. Cursor workspace root).
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: appRoot,
    },
  },
};

export default config;
