export default async function (req: any, res: any) {
  // @ts-ignore
  const m = await import("../../dist/api.cjs");
  const run = m.default?.default || m.default || m;
  if (typeof run !== "function") {
    throw new Error(`Imported handler is not a function: ` + typeof run);
  }
  return run(req, res);
}
