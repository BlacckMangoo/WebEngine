import Camera from '@/src/graphics/camera'
import { Entity } from '../core/entity'
import { Light, createDirectionalLight } from './light'
import { allocVec3 } from '@/math/vec3'
import { Assets } from '@/src/assetManager'
import { Mesh } from './mesh'
import { gl } from '@/src/graphics/context'
import { Transform } from './transform'
import { Renderable, Material } from './renderable'

type Vec3Tuple = [number, number, number]

export interface CreateEntityOptions {
  mesh: string
  material?: Material
  position: Vec3Tuple
  scale: Vec3Tuple
}

export class Scene {
  camera: Camera
  entities: Entity[] = []
  directionalLight: Light

  constructor(camera: Camera) {
    this.camera = camera
    this.directionalLight = createDirectionalLight(
      allocVec3(-0.5, 1.0, -0.5),
      { r: 1.0, g: 1.0, b: 1.0 },
      1.0
    )
  }

  createEntity(options: CreateEntityOptions): Entity {
    const mesh = new Mesh(Assets.getModel(options.mesh), gl)
    const transform = new Transform()
      .setTranslation(options.position[0], options.position[1], options.position[2])
      .setScale(options.scale[0], options.scale[1], options.scale[2])
    const renderable = new Renderable(mesh, options.material ?? Assets.getDefaultMaterial(), transform)

    const entity: Entity = { transform, renderable }
    this.entities.push(entity)
    return entity
  }

  add(entity: Entity): void {
    this.entities.push(entity)
  }

  setDirectionalLight(light: Light): void {
    this.directionalLight = light
  }
}
