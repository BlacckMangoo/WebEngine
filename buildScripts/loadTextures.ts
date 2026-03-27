import fs from 'fs'
import path from 'path'

const IMAGES_DIR = './public/assets/images'
const OUT_DIR = './src/graphics'
const OUT_FILE = path.join(OUT_DIR, 'textureData.ts')

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
])

interface ImageSourceEntry {
	name: string
	src: string
}

function toPosixPath(filePath: string): string {
	return filePath.split(path.sep).join('/')
}

function collectImageFiles(baseDir: string, currentDir: string = baseDir): string[] {
	const entries = fs.readdirSync(currentDir, { withFileTypes: true })
	const files: string[] = []

	for (const entry of entries) {
		const absolutePath = path.join(currentDir, entry.name)
		if (entry.isDirectory()) {
			files.push(...collectImageFiles(baseDir, absolutePath))
			continue
		}

		const ext = path.extname(entry.name).toLowerCase()
		if (!SUPPORTED_IMAGE_EXTENSIONS.has(ext)) {
			continue
		}

		files.push(path.relative(baseDir, absolutePath))
	}

	return files
}

function buildImageEntries(baseDir: string): ImageSourceEntry[] {
	if (!fs.existsSync(baseDir)) {
		return []
	}

	const relativeFiles = collectImageFiles(baseDir)
	const images = relativeFiles.map((filePath) => {
		const posixRelative = toPosixPath(filePath)
		const ext = path.extname(posixRelative)
		const name = posixRelative.slice(0, -ext.length)

		return {
			name,
			src: `./assets/images/${posixRelative}`,
		}
	})

	images.sort((a, b) => a.name.localeCompare(b.name))
	return images
}

function createTextureDataSource(entries: ImageSourceEntry[]): string {
	let output = "import { loadImage as LoadImage } from './image'\n\n"
	output += 'export const IMAGES = {\n'

	for (const entry of entries) {
		output += `  ${JSON.stringify(entry.name)}: await LoadImage(${JSON.stringify(entry.src)}),\n`
	}

	output += '} as const;\n\n'
	output += 'export type ImageName = keyof typeof IMAGES;\n'
	output += 'export type ImageValue = (typeof IMAGES)[ImageName];\n\n'
	output += 'export const ImageEntries = IMAGES;\n'
	output += 'export const ImageEntires = ImageEntries;\n\n'
	output += 'export type ImageEntryName = keyof typeof ImageEntries;\n'
	output += 'export type ImageEntry = (typeof ImageEntries)[ImageEntryName];\n'

	return output
}

const imageEntries = buildImageEntries(IMAGES_DIR)
const output = createTextureDataSource(imageEntries)

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, output, 'utf8')
