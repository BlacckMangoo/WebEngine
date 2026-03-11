import Camera from '@/src/graphics/camera'
import { Entity } from '../core/entity'
import { Light, createDirectionalLight } from './light'
import { allocVec3 } from '@/math/vec3'

export class Scene {
  camera: Camera
  entities: Entity[] = []
  directionalLight: Light

  constructor(camera: Camera) {
    this.camera = camera
    this.directionalLight = createDirectionalLight(
      allocVec3(-0.5, -1.0, -0.5),
      allocVec3(1.0, 1.0, 1.0),
      1.0
    )
  }

  add(entity: Entity): void {
    this.entities.push(entity)
  }

  setDirectionalLight(light: Light): void {
    this.directionalLight = light
  }
}
