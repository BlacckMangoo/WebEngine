// buildScripts/loadTextures.ts
import fs from "fs";
import path from "path";
var IMAGES_DIR = "./public/assets/images";
var OUT_DIR = "./src/graphics";
var OUT_FILE = path.join(OUT_DIR, "textureData.ts");
var SUPPORTED_IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".png",
  ".jpg",
  ".jpeg"
]);
function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}
function collectImageFiles(baseDir, currentDir = baseDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectImageFiles(baseDir, absolutePath));
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_IMAGE_EXTENSIONS.has(ext)) {
      continue;
    }
    files.push(path.relative(baseDir, absolutePath));
  }
  return files;
}
function buildImageEntries(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  const relativeFiles = collectImageFiles(baseDir);
  const images = relativeFiles.map((filePath) => {
    const posixRelative = toPosixPath(filePath);
    const ext = path.extname(posixRelative);
    const name = posixRelative.slice(0, -ext.length);
    return {
      name,
      src: `./assets/images/${posixRelative}`
    };
  });
  images.sort((a, b) => a.name.localeCompare(b.name));
  return images;
}
function createTextureDataSource(entries) {
  let output2 = "import { loadImage as LoadImage } from './image'\n\n";
  output2 += "export const IMAGES = {\n";
  for (const entry of entries) {
    output2 += `  ${JSON.stringify(entry.name)}: await LoadImage(${JSON.stringify(entry.src)}),
`;
  }
  output2 += "} as const;\n\n";
  output2 += "export type ImageName = keyof typeof IMAGES;\n";
  output2 += "export type ImageValue = (typeof IMAGES)[ImageName];\n\n";
  output2 += "export const ImageEntries = IMAGES;\n";
  output2 += "export const ImageEntires = ImageEntries;\n\n";
  output2 += "export type ImageEntryName = keyof typeof ImageEntries;\n";
  output2 += "export type ImageEntry = (typeof ImageEntries)[ImageEntryName];\n";
  return output2;
}
var imageEntries = buildImageEntries(IMAGES_DIR);
var output = createTextureDataSource(imageEntries);
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, output, "utf8");
//# sourceMappingURL=loadTextures.js.map
