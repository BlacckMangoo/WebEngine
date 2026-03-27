import { gl } from './context'
import { CUBEMAPS, CubeMapEntry, CubeMapName } from './cubemapData'
import { loadImage } from './image'
import Texture from './texture'

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
	readonly texture: Texture
	readonly entry: CubeMapEntry
	ready = false

	constructor(name: CubeMapName) {
		this.name = name
		this.entry = CUBEMAPS[name]
		this.texture = new Texture(gl.TEXTURE_CUBE_MAP)
		void this.loadFaces()
	}

	bind(unit = 0): void {
		this.texture.bind(unit)
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

			gl.generateMipmap(this.texture.target)
			gl.texParameteri(
				this.texture.target,
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

