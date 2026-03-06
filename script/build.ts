import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    // Keeping the server bundle readable makes Railway/runtime crashes debuggable.
    // (If you really want minification, set MINIFY=true in the build environment.)
    minify: process.env.MINIFY === "true",
    sourcemap: true,
    external: externals,
    logLevel: "info",
  });

  // Bundle the Vercel serverless entry point so that all server/ and shared/
  // imports are inlined into a single file.  This avoids ERR_MODULE_NOT_FOUND
  // at runtime because Vercel's @vercel/node builder doesn't compile imported
  // TypeScript files outside the api/ directory.
  console.log("building vercel serverless function...");
  await esbuild({
    entryPoints: ["api/_server.ts"],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: "api/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: process.env.MINIFY === "true",
    sourcemap: true,
    banner: {
      js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
    },
    external: externals,
    logLevel: "info",
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
