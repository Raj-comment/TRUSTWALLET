<<<<<<< HEAD
import path from "path";

// Load the pre-built serverless bundle produced by `npm run build`.
// Using require() at runtime avoids Vercel's TS transpiler trying to resolve
// all server/ imports (many of which need bundled native deps).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: handler } = require(path.join(process.cwd(), "dist", "api.cjs"));

export default handler;
=======
// Use the pre-built bundle so Vercel doesn't need to compile server/* from source.
// The build step (script/build.ts) compiles server/vercel-handler.ts → dist/api.cjs
// with all dependencies already bundled via esbuild.
const mod = require("../dist/api.cjs");
export default mod.default;
>>>>>>> 1721ef01083669cd516118c504dc4c23ca4c21a6
