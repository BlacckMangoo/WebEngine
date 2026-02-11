import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await Promise.all([
    // Browser bundle
    esbuild.build({
        entryPoints: ["src/index.ts"],
        outdir: "public/dist",
        bundle: true,
        format: "esm",
        platform: "browser",
        target: "esnext",
        sourcemap: true,
        logLevel: "info",
        alias: {
            "@": __dirname,
            "@public": path.join(__dirname, "public")
        }
    }),

    // Node tooling bundle
    esbuild.build({
        entryPoints: ["buildScripts/parseObj.ts" , "buildScripts/buildShaders.ts", "buildScripts/loadCubemaps.ts" ],
        outdir: "dist",
        bundle: true,
        format: "esm",
        platform: "node",
        target: "esnext",
        sourcemap: true,
        logLevel: "info"
    })
]);
