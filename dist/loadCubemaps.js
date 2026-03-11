// buildScripts/loadCubemaps.ts
import fs from "fs";
import path from "path";
var CM_DIR = "./public/assets/cubemaps";
var REQUIRED_FACES = ["px", "nx", "py", "ny", "pz", "nz"];
function loadCubemap(dirName) {
  const cubeMapDir = path.join(CM_DIR, dirName);
  const entries = fs.readdirSync(cubeMapDir);
  const result = {};
  for (const face of REQUIRED_FACES) {
    const file = entries.find((f) => f.startsWith(face + "."));
    if (!file) {
      throw new Error(`Missing ${face} in cubemap ${dirName}`);
    }
    result[face] = `./assets/cubemaps/${dirName}/${file}`;
  }
  return {
    name: dirName,
    files: result
  };
}
function loadCubemaps(baseDir) {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const cubeMaps2 = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    cubeMaps2.push(loadCubemap(entry.name));
  }
  return cubeMaps2;
}
var cubeMaps = loadCubemaps(CM_DIR);
var output = `export const CUBEMAPS = {
`;
for (const cm of cubeMaps) {
  output += `  ${cm.name}: {
`;
  for (const face of REQUIRED_FACES) {
    output += `    ${face}: ${JSON.stringify(cm.files[face])},
`;
  }
  output += `  },
`;
}
output += `} as const;

`;
output += `export type CubeMapName = keyof typeof CUBEMAPS;
`;
output += "export type CubeMapEntry = typeof CUBEMAPS[CubeMapName];\n";
var OUT_DIR = "./src/graphics";
var OUT_FILE = path.join(OUT_DIR, "cubemapData.ts");
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, output, "utf8");
//# sourceMappingURL=loadCubemaps.js.map
