import fs from "fs";
import path from "path";

const CM_DIR = "./assets/cubemaps";

const REQUIRED_FACES = ["px", "nx", "py", "ny", "pz", "nz"];

interface CubeMapData {
    name: string;
    files: Record<string, string>;
}

function loadCubemap(dirName: string): CubeMapData {
    const cubeMapDir = path.join(CM_DIR, dirName);

    const entries = fs.readdirSync(cubeMapDir);

    const result: Record<string, string> = {};

    for (const face of REQUIRED_FACES) {
        const file = entries.find(f => f.startsWith(face + "."));

        if (!file) {
            throw new Error(`Missing ${face} in cubemap ${dirName}`);
        }

        result[face] = path.join(cubeMapDir, file);
    }

    return {
        name: dirName,
        files: result
    };
}

function loadCubemaps(baseDir: string): CubeMapData[] {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    const cubeMaps: CubeMapData[] = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        cubeMaps.push(loadCubemap(entry.name));
    }

    return cubeMaps;
}

const cubeMaps = loadCubemaps(CM_DIR);

// generate a ts file
// format
// export const CUBEMAPS = {
//   name: {
//     px: "path/to/px.png",
//     nx: "path/to/nx.png",
//     py: "path/to/py.png",
//     ny: "path/to/ny.png",
//     pz: "path/to/pz.png",
//     nz: "path/to/nz.png",
//   },
//   ...
// } as const;
// export type CubeMapName = keyof typeof CUBEMAPS;

let output = `export const CUBEMAPS = {\n`;

for (const cm of cubeMaps) {
    output += `  ${cm.name}: {\n`;
    for (const face of REQUIRED_FACES) {
        output += `    ${face}: ${JSON.stringify(cm.files[face])},\n`;
    }
    output += `  },\n`;
}

output += `} as const;\n\n`;
output += `export type CubeMapName = keyof typeof CUBEMAPS;\n`;
output += 'export type CubeMapEntry = typeof CUBEMAPS[CubeMapName];\n';

const OUT_DIR = "./src/graphics";
const OUT_FILE = path.join(OUT_DIR, "cubemapData.ts");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, output, "utf8");
