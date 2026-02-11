import { opendir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

const SHADER_DIR = "./public/assets/shader";
const OUT_DIR = "./src/graphics";
const OUT_FILE = path.join(OUT_DIR, "shaderSrc.ts");

async function buildShaders() {
    const entries: string[] = [];

    const dir = await opendir(SHADER_DIR);
    for await (const d of dir) {
        if (d.isFile()) {
            entries.push(d.name);
        }
    }

    entries.sort();

    let output =`export const SHADERS = {\n`;

    for (const file of entries) {
        const content = await readFile(
            path.join(SHADER_DIR, file),
            "utf8"
        );

        const name = file.split(".")[0];

        output += `  ${name}: ${JSON.stringify(content)},\n`;
    }

    output += `} as const;\n\n`;
    output += `export type ShaderName = keyof typeof SHADERS;\n`;

    await mkdir(OUT_DIR, { recursive: true });
    await writeFile(OUT_FILE, output, "utf8");
}

buildShaders().catch(err => {
    console.error(err);
    process.exit(1);
});
