import { allocVec3 } from '@/math/vec3'
import { Assets } from '@/src/assetManager'
import { Entity } from '@/src/core/entity'
import { Material, Renderable } from '@/src/graphics/renderable'
import { Mesh } from '@/src/graphics/mesh'
import { Transform } from '@/src/graphics/transform'
import { gl } from '@/src/graphics/context'
import {
  PhysicsCollider,
  Rigidbody,
  RigidbodyType,
} from '@/src/physics/physics'

type Vec3Tuple = [number, number, number]

export interface CreateEntityOptions {
  mesh: string
  material: Material
  position: Vec3Tuple
  scale: Vec3Tuple
  rigidbody: Rigidbody
  collider: boolean
  colliderDebug?: boolean
}

export function makeRigidbody(
  type: RigidbodyType,
  mass: number,
  restitution: number,
  velocityX = 0,
  velocityY = 0,
  velocityZ = 0
): Rigidbody {
  return {
    type,
    mass,
    restitution,
    velocity: allocVec3(velocityX, velocityY, velocityZ),
    acceleration: allocVec3(0, 0, 0),
  }
}

export function createEntity(options: CreateEntityOptions): Entity {
  const mesh = new Mesh(Assets.getModel(options.mesh), gl)
  const transform = new Transform()
    .setTranslation(
      options.position[0],
      options.position[1],
      options.position[2]
    )
    .setScale(options.scale[0], options.scale[1], options.scale[2])
  const renderable = new Renderable(mesh, options.material, transform)

  const physicsCollider = options.collider
    ? ({
        aabb: mesh.aabb,
        showDebug: options.colliderDebug ?? false,
      } as PhysicsCollider)
    : null

  return {
    transform,
    renderable,
    physicsCollider,
    rigidbody: options.rigidbody,
  }
}
