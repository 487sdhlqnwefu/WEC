import * as esbuild from "esbuild";
import path from "node:path";

const root = process.cwd();

const aliases = {
  "@throwdown": path.join(root, "domain/throwdown"),
  "@db": path.join(root, "db"),
  "@contracts": path.join(root, "contracts"),
};

await esbuild.build({
  entryPoints: ["api/boot.ts"],
  platform: "node",
  bundle: true,
  format: "esm",
  outdir: "dist",
  resolveExtensions: [".ts", ".js", ".tsx", ".mjs"],
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
  plugins: [
    {
      name: "workspace-aliases",
      setup(build) {
        build.onResolve({ filter: /^(?:@throwdown|@db|@contracts)(?:\/|$)/ }, (args) => {
          for (const [prefix, target] of Object.entries(aliases)) {
            if (args.path === prefix || args.path.startsWith(`${prefix}/`)) {
              const remainder = args.path.slice(prefix.length).replace(/^\//, "");
              const resolved = remainder ? path.join(target, remainder) : path.join(target, "index");
              return { path: resolved.endsWith(".ts") ? resolved : `${resolved}.ts` };
            }
          }
          return undefined;
        });
      },
    },
  ],
});
