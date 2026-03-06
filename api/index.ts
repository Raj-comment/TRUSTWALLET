import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Use a dynamic import to avoid Vercel's static analysis failing on 
  // missing dependencies during pre-build configuration validation.
  // The actual server code is compiled into dist/api.cjs during the build step.
  const modulePath = "../dist/api.cjs";
  const { default: app } = await import(modulePath);
  return app(req, res);
}
