import { Vec3 } from '@/math/vec3'
import { Transform } from '../graphics/transform'
import { allocVec3, scaleAndAdd } from '@/math/vec3'

class AABB {
  constructor(
    public min: Vec3,
    public max: Vec3
  ) {
    this.min = min
    this.max = max
  }

  intersects(other: AABB): boolean {
    return (
      this.min[0] <= other.max[0] &&
      this.max[0] >= other.min[0] &&
      this.min[1] <= other.max[1] &&
      this.max[1] >= other.min[1] &&
      this.min[2] <= other.max[2] &&
      this.max[2] >= other.min[2]
    )
  }
}

export function aabbFromLocalToWorld(
  localAABB: AABB,
  transform: Transform
): AABB {
  // get the 8 corners of the local AABB
  const corner1 = allocVec3(
    localAABB.min[0],
    localAABB.min[1],
    localAABB.min[2]
  )
  const corner2 = allocVec3(
    localAABB.max[0],
    localAABB.min[1],
    localAABB.min[2]
  )
  const corner3 = allocVec3(
    localAABB.min[0],
    localAABB.max[1],
    localAABB.min[2]
  )
  const corner4 = allocVec3(
    localAABB.min[0],
    localAABB.min[1],
    localAABB.max[2]
  )
  const corner5 = allocVec3(
    localAABB.max[0],
    localAABB.max[1],
    localAABB.min[2]
  )
  const corner6 = allocVec3(
    localAABB.max[0],
    localAABB.min[1],
    localAABB.max[2]
  )
  const corner7 = allocVec3(
    localAABB.min[0],
    localAABB.max[1],
    localAABB.max[2]
  )
  const corner8 = allocVec3(
    localAABB.max[0],
    localAABB.max[1],
    localAABB.max[2]
  )

  // Transform currently applies scale and translation only.

  const localCorners = [
    corner1,
    corner2,
    corner3,
    corner4,
    corner5,
    corner6,
    corner7,
    corner8,
  ]

  const worldMin = allocVec3(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY
  )
  const worldMax = allocVec3(
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY
  )

  for (const localCorner of localCorners) {
    const scaledCorner = allocVec3(
      localCorner[0] * transform.scaling[0],
      localCorner[1] * transform.scaling[1],
      localCorner[2] * transform.scaling[2]
    )


    const worldCorner = allocVec3()
    scaleAndAdd(worldCorner, transform.position, scaledCorner, 1)

    worldMin[0] = Math.min(worldMin[0], worldCorner[0])
    worldMin[1] = Math.min(worldMin[1], worldCorner[1])
    worldMin[2] = Math.min(worldMin[2], worldCorner[2])

    worldMax[0] = Math.max(worldMax[0], worldCorner[0])
    worldMax[1] = Math.max(worldMax[1], worldCorner[1])
    worldMax[2] = Math.max(worldMax[2], worldCorner[2])
  }

  return new AABB(worldMin, worldMax)
}

export { AABB }
