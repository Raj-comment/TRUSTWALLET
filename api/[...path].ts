import { createRequire } from "module";

const require = createRequire(import.meta.url);

let handler: any = null;

export default async function (req: any, res: any) {
  if (!handler) {
    const mod = require("../dist/api.cjs");
    handler = mod.default || mod;
  }
  return handler(req, res);
}
