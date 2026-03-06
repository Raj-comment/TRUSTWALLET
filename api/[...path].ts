// Use the pre-built bundle so Vercel doesn't need to compile server/* from source.
// The build step (script/build.ts) compiles server/vercel-handler.ts → dist/api.cjs
// with all dependencies already bundled via esbuild.
const mod = require("../dist/api.cjs");
export default mod.default;
