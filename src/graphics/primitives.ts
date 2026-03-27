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

  uvs: [
    // Front
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
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

// Cube wireframe with 8 unique corners and 12 edges (24 indices for LINES)
export const CUBE_WIREFRAME: ModelData = {
  vertices: [
    // z = 0.5
    -0.5, -0.5, 0.5, // 0
    0.5, -0.5, 0.5, // 1
    0.5, 0.5, 0.5, // 2
    -0.5, 0.5, 0.5, // 3

    // z = -0.5
    -0.5, -0.5, -0.5, // 4
    0.5, -0.5, -0.5, // 5
    0.5, 0.5, -0.5, // 6
    -0.5, 0.5, -0.5, // 7
  ],

  normals: [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
  ],

  uvs: [
    0, 0,
    0, 0,
    0, 0,
    0, 0,
    0, 0,
    0, 0,
    0, 0,
    0, 0,
  ],

  indices: [
    // Front square
    0, 1,
    1, 2,
    2, 3,
    3, 0,

    // Back square
    4, 5,
    5, 6,
    6, 7,
    7, 4,

    // Connectors
    0, 4,
    1, 5,
    2, 6,
    3, 7,
  ],
}

export function createGrid(
  width: number,
  height: number,
  cells: number
): ModelData {
  const safeWidth = Math.max(0.001, width)
  const safeHeight = Math.max(0.001, height)
  const safeCells = Math.max(1, Math.floor(cells))

  const halfW = safeWidth * 0.5
  const halfH = safeHeight * 0.5
  const stepX = safeWidth / safeCells
  const stepZ = safeHeight / safeCells

  const vertices: number[] = []
  const indices: number[] = []

  const pushSegment = (
    ax: number,
    ay: number,
    az: number,
    bx: number,
    by: number,
    bz: number
  ): void => {
    const start = vertices.length / 3
    vertices.push(ax, ay, az, bx, by, bz)
    indices.push(start, start + 1)
  }

  for (let i = 0; i <= safeCells; i++) {
    const x = -halfW + i * stepX
    pushSegment(x, 0, -halfH, x, 0, halfH)
  }

  for (let i = 0; i <= safeCells; i++) {
    const z = -halfH + i * stepZ
    pushSegment(-halfW, 0, z, halfW, 0, z)
  }

  const normals = new Array(vertices.length).fill(0)
  const uvs = new Array((vertices.length / 3) * 2).fill(0)

  return {
    vertices,
    normals,
    uvs,
    indices,
  }
}

export interface GridPrimitiveConfig {
  grid: ModelData
  includeAxes: boolean
  axisRadius: number
  axisLength: number
  axisCylinder?: ModelData
  axisDefinitions: Array<{
    color: { r: number; g: number; b: number }
    rotationAxis: [number, number, number]
    angle: number
  }>
}

export interface GridSpawnDescriptor {
  mesh: string
  primitive: 'lines' | 'triangles'
  color: { r: number; g: number; b: number }
  alpha?: number
  roughness: number
  metallic: number
  ao: number
  rotationAxis?: [number, number, number]
  angle?: number
}

export function createGridPrimitive(
  width: number,
  height: number,
  cells: number,
  includeAxes: boolean
): GridPrimitiveConfig {
  const safeWidth = Math.max(0.001, width)
  const safeHeight = Math.max(0.001, height)
  const axisWidth = 0.024
  const axisDivisions = 24
  const axisLength = Math.max(safeWidth, safeHeight)
  const axisRadius = Math.max(0.001, axisWidth)

  return {
    grid: createGrid(safeWidth, safeHeight, cells),
    includeAxes,
    axisRadius,
    axisLength,
    axisCylinder: includeAxes
      ? createCylinder(axisLength, axisDivisions, axisRadius)
      : undefined,
    axisDefinitions: includeAxes
      ? [
          {
            color: { r: 0.2, g: 0.95, b: 0.35 },
            rotationAxis: [0, 1, 0],
            angle: 0,
          },
          {
            color: { r: 0.95, g: 0.2, b: 0.2 },
            rotationAxis: [0, 0, 1],
            angle: -Math.PI * 0.5,
          },
          {
            color: { r: 0.2, g: 0.5, b: 0.95 },
            rotationAxis: [1, 0, 0],
            angle: Math.PI * 0.5,
          },
        ]
      : [],
  }
}

export const GRID_CONFIG: GridPrimitiveConfig = createGridPrimitive(
  10,
  10,
  20,
  true
)
export const GRID: ModelData = GRID_CONFIG.grid

export function createGridSpawnDescriptors(
  includeAxes: boolean
): GridSpawnDescriptor[] {
  const descriptors: GridSpawnDescriptor[] = [
    {
      mesh: 'grid',
      primitive: 'lines',
      color: { r: 1.0, g: 1.0, b: 1.0 },
      alpha: 0.1,
      roughness: 1.0,
      metallic: 0.0,
      ao: 1.0,
    },
  ]

  if (!includeAxes || !GRID_CONFIG.includeAxes || !GRID_CONFIG.axisCylinder) {
    return descriptors
  }

  for (const axis of GRID_CONFIG.axisDefinitions) {
    descriptors.push({
      mesh: 'gridAxisCylinder',
      primitive: 'triangles',
      color: axis.color,
      roughness: 0.45,
      metallic: 0.1,
      ao: 1.0,
      rotationAxis: axis.rotationAxis,
      angle: axis.angle,
    })
  }

  return descriptors
}

export function createCylinder(
  height: number,
  divisions: number,
  radius: number = 0.5
): ModelData {
  const safeHeight = Math.max(0.001, height)
  const safeRadius = Math.max(0.001, radius)
  const safeDivisions = Math.max(3, Math.floor(divisions))

  const halfH = safeHeight * 0.5
  const tau = Math.PI * 2

  const vertices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const pushVertex = (
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
    u: number,
    v: number
  ): number => {
    const index = vertices.length / 3
    vertices.push(x, y, z)
    normals.push(nx, ny, nz)
    uvs.push(u, v)
    return index
  }

  const pushTriangle = (a: number, b: number, c: number): void => {
    indices.push(a, b, c)
  }

  // Side surface
  for (let i = 0; i < safeDivisions; i++) {
    const t0 = i / safeDivisions
    const t1 = (i + 1) / safeDivisions
    const a0 = tau * t0
    const a1 = tau * t1

    const x0 = Math.cos(a0) * safeRadius
    const z0 = Math.sin(a0) * safeRadius
    const x1 = Math.cos(a1) * safeRadius
    const z1 = Math.sin(a1) * safeRadius

    const i0 = pushVertex(x0, -halfH, z0, Math.cos(a0), 0, Math.sin(a0), t0, 0)
    const i1 = pushVertex(x0, halfH, z0, Math.cos(a0), 0, Math.sin(a0), t0, 1)
    const i2 = pushVertex(x1, -halfH, z1, Math.cos(a1), 0, Math.sin(a1), t1, 0)
    const i3 = pushVertex(x1, halfH, z1, Math.cos(a1), 0, Math.sin(a1), t1, 1)

    pushTriangle(i0, i1, i2)
    pushTriangle(i2, i1, i3)
  }

  // Top cap
  for (let i = 0; i < safeDivisions; i++) {
    const t0 = i / safeDivisions
    const t1 = (i + 1) / safeDivisions
    const a0 = tau * t0
    const a1 = tau * t1

    const c = pushVertex(0, halfH, 0, 0, 1, 0, 0.5, 0.5)
    const r0 = pushVertex(
      Math.cos(a0) * safeRadius,
      halfH,
      Math.sin(a0) * safeRadius,
      0,
      1,
      0,
      0.5 + 0.5 * Math.cos(a0),
      0.5 + 0.5 * Math.sin(a0)
    )
    const r1 = pushVertex(
      Math.cos(a1) * safeRadius,
      halfH,
      Math.sin(a1) * safeRadius,
      0,
      1,
      0,
      0.5 + 0.5 * Math.cos(a1),
      0.5 + 0.5 * Math.sin(a1)
    )

    pushTriangle(c, r0, r1)
  }

  // Bottom cap
  for (let i = 0; i < safeDivisions; i++) {
    const t0 = i / safeDivisions
    const t1 = (i + 1) / safeDivisions
    const a0 = tau * t0
    const a1 = tau * t1

    const c = pushVertex(0, -halfH, 0, 0, -1, 0, 0.5, 0.5)
    const r0 = pushVertex(
      Math.cos(a0) * safeRadius,
      -halfH,
      Math.sin(a0) * safeRadius,
      0,
      -1,
      0,
      0.5 + 0.5 * Math.cos(a0),
      0.5 + 0.5 * Math.sin(a0)
    )
    const r1 = pushVertex(
      Math.cos(a1) * safeRadius,
      -halfH,
      Math.sin(a1) * safeRadius,
      0,
      -1,
      0,
      0.5 + 0.5 * Math.cos(a1),
      0.5 + 0.5 * Math.sin(a1)
    )

    // Reverse winding so the normal points downward.
    pushTriangle(c, r1, r0)
  }

  return {
    vertices,
    normals,
    uvs,
    indices,
  }
}

export const CYLINDER: ModelData = createCylinder(1, 24)

// Plane (quad) - useful for testing
export const QUAD: ModelData = {
  vertices: [-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0],

  normals: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],

  uvs: [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],

  indices: [0, 1, 2, 0, 2, 3],
}

// Triangle - simplest primitive
export const TRIANGLE: ModelData = {
  vertices: [0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0],

  normals: [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0],

  uvs: [0.5, 1.0, 0.0, 0.0, 1.0, 0.0],

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

  uvs: [
    // Base tri 1
    0.0, 0.0, 1.0, 1.0, 1.0, 0.0,
    // Base tri 2
    0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
    // Front
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,
    // Right
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,
    // Back
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,
    // Left
    0.0, 0.0, 1.0, 0.0, 0.5, 1.0,
  ],

  indices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
}



