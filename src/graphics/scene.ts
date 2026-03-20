import { Entity } from '../core/entity'
import { Assets } from '@/src/assetManager'
import { Mesh } from './mesh'
import { gl } from '@/src/graphics/context'
import { Renderable, Material } from './renderable'
import Camera from './camera'
import Transform from './transform'

export interface CreateEntityOptions {
  mesh: string
  material?: Material
  transform :Transform
}

export class Scene {
  entities: Entity[] = []
  cam :Camera  = new Camera()
  createEntity(options: CreateEntityOptions): Entity {
    const mesh = new Mesh(Assets.getModel(options.mesh), gl)
    const renderable = new Renderable(mesh,options.material ?? Assets.getDefaultMaterial())
    const entity: Entity = new Entity(options)
    entity.renderable = renderable
    this.entities.push(entity)
    return entity
  }

  add(entity: Entity): void {
    this.entities.push(entity)
  }
}
