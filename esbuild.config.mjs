import esbuild from "esbuild";

await Promise.all([
    // Browser bundle
    esbuild.build({
        entryPoints: ["src/index.ts"],
        outdir: "dist",
        bundle: true,
        format: "esm",
        platform: "browser",
        target: "es2020",
        sourcemap: true,
        logLevel: "info"
    }),

    // Node tooling bundle
    esbuild.build({
        entryPoints: ["buildScripts/parseObj.ts"],
        outdir: "dist",
        bundle: true,
        format: "esm",
        platform: "node",
        target: "es2020",
        sourcemap: true,
        logLevel: "info"
    })
]);
