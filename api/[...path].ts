import path from "path";

// Load the pre-built serverless bundle produced by `npm run build`.
// Using require() at runtime avoids Vercel's TS transpiler trying to resolve
// all server/ imports (many of which need bundled native deps).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: handler } = require(path.join(process.cwd(), "dist", "api.cjs"));

export default handler;
