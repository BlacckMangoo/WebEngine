import esbuild from "esbuild";

await Promise.all([
    // Browser bundle
    esbuild.build({
        entryPoints: ["src/index.ts"],
        outdir: "dist",
        bundle: true,
        format: "esm",
        platform: "browser",
        target: "esnext",
        sourcemap: true,
        logLevel: "info"
    }),

    // Node tooling bundle
    esbuild.build({
        entryPoints: ["buildScripts/parseObj.ts" , "buildScripts/buildShaders.ts" ],
        outdir: "dist",
        bundle: true,
        format: "esm",
        platform: "node",
        target: "esnext",
        sourcemap: true,
        logLevel: "info"
    })
]);
