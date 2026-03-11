import { allocVec3 } from '@/math/vec3'
import { Rigidbody, RigidbodyType } from '@/src/physics/physics'

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


