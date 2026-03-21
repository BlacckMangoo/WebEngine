import { gl } from './context'
import { CUBEMAPS, CubeMapEntry, CubeMapName } from './cubemapData'
import { loadImage } from './image'

type CubeFaceKey = keyof CubeMapEntry

const FACE_ORDER: CubeFaceKey[] = ['px', 'py', 'pz', 'nx', 'ny', 'nz']

const FACE_TARGETS: Record<CubeFaceKey, number> = {
	px: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
	nx: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
	py: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
	ny: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
	pz: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
	nz: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
}

export class Cubemap {
	readonly name: CubeMapName
	readonly texture: WebGLTexture
	readonly entry: CubeMapEntry
	ready = false

	constructor(name: CubeMapName) {
		this.name = name
		this.entry = CUBEMAPS[name]
		const texture = gl.createTexture()
		if (!texture) {
			throw new Error('Failed to create cubemap texture')
		}
		this.texture = texture
		this.initPlaceholderFaces()
		void this.loadFaces()
	}

	bind(unit = 0): void {
		gl.activeTexture(gl.TEXTURE0 + unit)
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture)
	}

	private initPlaceholderFaces(): void {
		this.bind(0)
		const placeholder = new Uint8Array([80, 80, 80, 255])

		for (const face of FACE_ORDER) {
			gl.texImage2D(
				FACE_TARGETS[face],
				0,
				gl.RGBA,
				1,
				1,
				0,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				placeholder
			)
		}

		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE)
	}

	private async loadFaces(): Promise<void> {
		try {
			const loadedFaces = await Promise.all(
				FACE_ORDER.map(async (face) => {
					const image = await loadImage(this.entry[face])
					return { face, image }
				})
			)

			this.bind(0)
			for (const loaded of loadedFaces) {
				gl.texImage2D(
					FACE_TARGETS[loaded.face],
					0,
					gl.RGBA,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					loaded.image
				)
			}

			gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
			gl.texParameteri(
				gl.TEXTURE_CUBE_MAP,
				gl.TEXTURE_MIN_FILTER,
				gl.LINEAR_MIPMAP_LINEAR
			)
			this.ready = true
		} catch (error) {
			console.error(`Failed to load cubemap "${this.name}"`, error)
		}
	}
}

export function createCubemap(name: CubeMapName = 'skybox'): Cubemap {
	return new Cubemap(name)
}

