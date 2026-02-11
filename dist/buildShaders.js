// buildScripts/buildShaders.ts
import { opendir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
var SHADER_DIR = "./public/assets/shader";
var OUT_DIR = "./src/graphics";
var OUT_FILE = path.join(OUT_DIR, "shaderSrc.ts");
async function buildShaders() {
  const entries = [];
  const dir = await opendir(SHADER_DIR);
  for await (const d of dir) {
    if (d.isFile()) {
      entries.push(d.name);
    }
  }
  entries.sort();
  let output = `export const SHADERS = {
`;
  for (const file of entries) {
    const content = await readFile(
      path.join(SHADER_DIR, file),
      "utf8"
    );
    const name = file.split(".")[0];
    output += `  ${name}: ${JSON.stringify(content)},
`;
  }
  output += `} as const;

`;
  output += `export type ShaderName = keyof typeof SHADERS;
`;
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, output, "utf8");
}
buildShaders().catch((err) => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=buildShaders.js.map
