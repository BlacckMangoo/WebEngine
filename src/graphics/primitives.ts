import { ModelData } from './mesh'

/**
 * Primitive geometry data
 * All primitives are centered at origin with unit dimensions
 */

// Cube vertices (positions and normals interleaved)
// Each face has 4 vertices with their normals
export const CUBE: ModelData = {
  vertices: [
    // Front face (z = 0.5)
    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,

    // Back face (z = -0.5)
    -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,

    // Top face (y = 0.5)
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

    // Bottom face (y = -0.5)
    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,

    // Right face (x = 0.5)
    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,

    // Left face (x = -0.5)
    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
  ],

  normals: [
    // Front face
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    // Back face
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

    // Top face
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom face
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

    // Right face
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left face
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ],

  indices: [
    0,
    1,
    2,
    0,
    2,
    3, // Front
    4,
    5,
    6,
    4,
    6,
    7, // Back
    8,
    9,
    10,
    8,
    10,
    11, // Top
    12,
    13,
    14,
    12,
    14,
    15, // Bottom
    16,
    17,
    18,
    16,
    18,
    19, // Right
    20,
    21,
    22,
    20,
    22,
    23, // Left
  ],
}

// Plane (quad) - useful for testing
export const QUAD: ModelData = {
  vertices: [-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0],

  normals: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],

  indices: [0, 1, 2, 0, 2, 3],
}

// Triangle - simplest primitive
export const TRIANGLE: ModelData = {
  vertices: [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0],

  normals: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],

  indices: [0, 1, 2],
}

export const PYRAMID: ModelData = {
  vertices: [
    // ===== Base (2 triangles) =====
    -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,

    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,

    // ===== Front =====
    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.0, 0.5, 0.0,

    // ===== Right =====
    0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.0, 0.5, 0.0,

    // ===== Back =====
    0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.0, 0.5, 0.0,

    // ===== Left =====
    -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.0, 0.5, 0.0,
  ],

  normals: [
    // ===== Base (0, -1, 0) =====
    0, -1, 0, 0, -1, 0, 0, -1, 0,

    0, -1, 0, 0, -1, 0, 0, -1, 0,

    // ===== Front =====
    0, 0.7071, -0.7071, 0, 0.7071, -0.7071, 0, 0.7071, -0.7071,

    // ===== Right =====
    0.7071, 0.7071, 0, 0.7071, 0.7071, 0, 0.7071, 0.7071, 0,

    // ===== Back =====
    0, 0.7071, 0.7071, 0, 0.7071, 0.7071, 0, 0.7071, 0.7071,

    // ===== Left =====
    -0.7071, 0.7071, 0, -0.7071, 0.7071, 0, -0.7071, 0.7071, 0,
  ],

  indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
}

export function createSphere(
  radius: number = 0.5,
  subdivisions: number = 3
): ModelData {
  // Start from an icosahedron and subdivide
  const t = (1.0 + Math.sqrt(5.0)) / 2.0

  const baseVertices: [number, number, number][] = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ]

  // Normalize base vertices to unit sphere
  for (const v of baseVertices) {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
    v[0] /= len
    v[1] /= len
    v[2] /= len
  }

  let faces: [number, number, number][] = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ]

  const verts: [number, number, number][] = [...baseVertices]
  const midpointCache = new Map<string, number>()

  function getMidpoint(a: number, b: number): number {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`
    const cached = midpointCache.get(key)
    if (cached !== undefined) return cached

    const ax = verts[a][0],
      ay = verts[a][1],
      az = verts[a][2]
    const bx = verts[b][0],
      by = verts[b][1],
      bz = verts[b][2]
    let mx = (ax + bx) / 2,
      my = (ay + by) / 2,
      mz = (az + bz) / 2
    const len = Math.sqrt(mx * mx + my * my + mz * mz)
    mx /= len
    my /= len
    mz /= len

    const idx = verts.length
    verts.push([mx, my, mz])
    midpointCache.set(key, idx)
    return idx
  }

  for (let i = 0; i < subdivisions; i++) {
    const newFaces: [number, number, number][] = []
    for (const [a, b, c] of faces) {
      const ab = getMidpoint(a, b)
      const bc = getMidpoint(b, c)
      const ca = getMidpoint(c, a)
      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
    }
    faces = newFaces
    midpointCache.clear()
  }

  const vertices: number[] = []
  const normals: number[] = []
  const indices: number[] = []

  for (const v of verts) {
    vertices.push(v[0] * radius, v[1] * radius, v[2] * radius)
    // Normal is just the normalized position for a sphere
    normals.push(v[0], v[1], v[2])
  }

  for (const [a, b, c] of faces) {
    indices.push(a, b, c)
  }

  return { vertices, normals, indices }
}
