// buildScripts/parseObj.ts
import fs from "fs";
import readline from "readline";
import { opendir } from "fs/promises";
async function loadObj(filePath) {
  const modelnamesplit = filePath.split("/").pop()?.split(".");
  if (!modelnamesplit || modelnamesplit.length === 0) {
    throw new Error(`Invalid file path: ${filePath}`);
  }
  const modelname = modelnamesplit[0];
  const input = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input,
    crlfDelay: Infinity
  });
  const positions = [];
  const indices = [];
  for await (const line of rl) {
    if (!line || line[0] === "#") continue;
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/);
      positions.push(+x, +y, +z);
    }
    if (line.startsWith("f ")) {
      const [, a, b, c] = line.trim().split(/\s+/);
      indices.push(+a - 1, +b - 1, +c - 1);
    }
  }
  const vertices = new Float32Array(positions);
  const normals = new Float32Array(vertices.length);
  for (let i = 0; i < indices.length; i += 3) {
    const i0 = indices[i] * 3;
    const i1 = indices[i + 1] * 3;
    const i2 = indices[i + 2] * 3;
    const p0x = vertices[i0];
    const p0y = vertices[i0 + 1];
    const p0z = vertices[i0 + 2];
    const p1x = vertices[i1];
    const p1y = vertices[i1 + 1];
    const p1z = vertices[i1 + 2];
    const p2x = vertices[i2];
    const p2y = vertices[i2 + 1];
    const p2z = vertices[i2 + 2];
    const e1x = p1x - p0x;
    const e1y = p1y - p0y;
    const e1z = p1z - p0z;
    const e2x = p2x - p0x;
    const e2y = p2y - p0y;
    const e2z = p2z - p0z;
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    normals[i0] += nx;
    normals[i0 + 1] += ny;
    normals[i0 + 2] += nz;
    normals[i1] += nx;
    normals[i1 + 1] += ny;
    normals[i1 + 2] += nz;
    normals[i2] += nx;
    normals[i2 + 1] += ny;
    normals[i2 + 2] += nz;
  }
  for (let i = 0; i < normals.length; i += 3) {
    const x = normals[i];
    const y = normals[i + 1];
    const z = normals[i + 2];
    const len = Math.hypot(x, y, z);
    if (len > 1e-6) {
      normals[i] = x / len;
      normals[i + 1] = y / len;
      normals[i + 2] = z / len;
    }
  }
  fs.writeFileSync(
    "./assets/models/" + modelname + ".json",
    JSON.stringify({
      // flatten vertices to array of numbers
      vertices: Array.from(vertices),
      normals: Array.from(normals),
      indices
    }),
    "utf8"
  );
}
var modelDir = "./assets/models";
var modelNames = [];
var dir = await opendir(modelDir);
for await (const d of dir) {
  if (d.isFile()) {
    modelNames.push(d.name);
  }
}
for (const modelName of modelNames) {
  if (modelName.endsWith(".obj")) {
    console.log(`Processing ${modelName}...`);
    await loadObj(`${modelDir}/${modelName}`);
  }
}
export {
  loadObj
};
//# sourceMappingURL=parseObj.js.map
