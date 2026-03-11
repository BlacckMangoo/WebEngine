import { Vec3 } from '@/math/vec3'
import { allocVec3 } from '@/math/vec3'
import { Entity } from '../core/entity'
import { AABB } from './aabb'

export interface ContactPoint {
  posA: Vec3
  posB: Vec3
  normal: Vec3
  penetration: number
}

export class CollisionManifold {
  entityA: Entity
  entityB: Entity
  normal: Vec3
  penetration: number
  contactPoints: ContactPoint[] = []

  constructor(
    entityA: Entity,
    entityB: Entity,
    normal: Vec3,
    penetration: number
  ) {
    this.entityA = entityA
    this.entityB = entityB
    this.normal = normal
    this.penetration = penetration
  }
}

function getAABBCenter(aabb: AABB): Vec3 {
  return allocVec3(
    (aabb.min[0] + aabb.max[0]) * 0.5,
    (aabb.min[1] + aabb.max[1]) * 0.5,
    (aabb.min[2] + aabb.max[2]) * 0.5
  )
}

function getCollisionAxis(
  a: AABB,
  b: AABB
): { normal: Vec3; penetration: number } | null {
  const overlapX = Math.min(a.max[0], b.max[0]) - Math.max(a.min[0], b.min[0])
  const overlapY = Math.min(a.max[1], b.max[1]) - Math.max(a.min[1], b.min[1])
  const overlapZ = Math.min(a.max[2], b.max[2]) - Math.max(a.min[2], b.min[2])

  if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {
    return null
  }

  const centerA = getAABBCenter(a)
  const centerB = getAABBCenter(b)

  let normal = allocVec3(1, 0, 0)
  let penetration = overlapX

  if (overlapY < penetration) {
    normal = allocVec3(0, 1, 0)
    penetration = overlapY
  }

  if (overlapZ < penetration) {
    normal = allocVec3(0, 0, 1)
    penetration = overlapZ
  }

  if (normal[0] !== 0 && centerB[0] < centerA[0]) normal[0] = -1
  if (normal[1] !== 0 && centerB[1] < centerA[1]) normal[1] = -1
  if (normal[2] !== 0 && centerB[2] < centerA[2]) normal[2] = -1

  return { normal, penetration }
}

function buildContactPoint(
  a: AABB,
  b: AABB,
  normal: Vec3,
  penetration: number
): ContactPoint {
  const centerA = getAABBCenter(a)
  const centerB = getAABBCenter(b)

  const posA = allocVec3(
    centerA[0] + normal[0] * 0.5 * penetration,
    centerA[1] + normal[1] * 0.5 * penetration,
    centerA[2] + normal[2] * 0.5 * penetration
  )

  const posB = allocVec3(
    centerB[0] - normal[0] * 0.5 * penetration,
    centerB[1] - normal[1] * 0.5 * penetration,
    centerB[2] - normal[2] * 0.5 * penetration
  )

  return {
    posA,
    posB,
    normal: allocVec3(normal[0], normal[1], normal[2]),
    penetration,
  }
}

export function createAABBManifold(
  entityA: Entity,
  entityB: Entity,
  worldAABB: AABB,
  worldBABB: AABB
): CollisionManifold | null {
  if (!worldAABB.intersects(worldBABB)) {
    return null
  }

  const axis = getCollisionAxis(worldAABB, worldBABB)
  if (!axis) {
    return null
  }

  const manifold = new CollisionManifold(
    entityA,
    entityB,
    axis.normal,
    axis.penetration
  )
  manifold.contactPoints.push(
    buildContactPoint(worldAABB, worldBABB, axis.normal, axis.penetration)
  )
  return manifold
}
