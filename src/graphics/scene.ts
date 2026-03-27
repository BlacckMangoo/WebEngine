import { Entity } from '../core/entity'
import { Assets } from '@/src/core/assetManager'
import { Mesh } from './mesh'
import { gl } from '@/src/graphics/context'
import { Renderable, Material } from './renderable'
import Camera from './camera'
import Transform from './transform'
import { CubeMapName } from './cubemapData'

export interface CreateEntityOptions {
  mesh: string
  material?: Material
  transform :Transform
  primitive?: GLenum
}

export class Scene {
  entities: Entity[] = [];
  cam: Camera;
  private meshCache = new Map<string, Mesh>()

  private getOrCreateMesh(name: string, primitive: GLenum): Mesh {
    const cacheKey = `${name}:${primitive}`
    const cached = this.meshCache.get(cacheKey)
    if (cached) {
      return cached
    }

    const mesh = new Mesh(Assets.getModel(name), gl, primitive)
    this.meshCache.set(cacheKey, mesh)
    return mesh
  }

  createEntity(options: CreateEntityOptions): Entity {
    const primitive = options.primitive ?? gl.TRIANGLES
    const mesh = this.getOrCreateMesh(options.mesh, primitive)
    const renderable = new Renderable(mesh,options.material ?? Assets.getDefaultMaterial())
    const entity: Entity = new Entity(options)
    entity.renderable = renderable
    this.entities.push(entity)
    return entity
  }

  constructor(skyboxName?: CubeMapName) {
    this.cam = new Camera(skyboxName)
  }

  add(entity: Entity): void {
    this.entities.push(entity)
  }
}
