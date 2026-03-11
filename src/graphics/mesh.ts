import { gl } from '@/src/graphics/context'
import { AABB } from '@/src/physics/aabb'
import { allocVec3 } from '@/math/vec3'

type MeshPrimitive = GLenum

type VertexAttribute = {
  location: number
  size: number
  type: GLenum
  normalized: boolean
  offset: number
}

class VertexLayout {
  stride: number
  attributes: VertexAttribute[]

  constructor(stride: number, attributes: VertexAttribute[]) {
    this.stride = stride
    this.attributes = attributes
  }
}

export interface ModelData {
  vertices: number[]
  normals?: number[]
  indices: number[]
}

// Layout: position (3 floats) + normal (3 floats) = 6 floats * 4 bytes = 24 bytes stride
let pos3norm3 = new VertexLayout(24, [
  { location: 0, size: 3, type: gl.FLOAT, normalized: false, offset: 0 },
  { location: 1, size: 3, type: gl.FLOAT, normalized: false, offset: 12 },
])

function createAABBWireframeData(aabb: AABB): ModelData {
  const minX = aabb.min[0]
  const minY = aabb.min[1]
  const minZ = aabb.min[2]

  const maxX = aabb.max[0]
  const maxY = aabb.max[1]
  const maxZ = aabb.max[2]

  const vertices = [
    minX,
    minY,
    minZ,
    maxX,
    minY,
    minZ,
    maxX,
    maxY,
    minZ,
    minX,
    maxY,
    minZ,
    minX,
    minY,
    maxZ,
    maxX,
    minY,
    maxZ,
    maxX,
    maxY,
    maxZ,
    minX,
    maxY,
    maxZ,
  ]

  const indices = [
    0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7,
  ]

  return { vertices, indices }
}

export function createAABBFromVertices(vertices: number[]): AABB {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let minZ = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  let maxZ = Number.NEGATIVE_INFINITY

  let x: number, y: number, z: number

  for (let i = 0; i < vertices.length; i += 3) {
    x = vertices[i]
    y = vertices[i + 1]
    z = vertices[i + 2]

    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z

    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }

  const min = allocVec3(minX, minY, minZ)
  const max = allocVec3(maxX, maxY, maxZ)

  return new AABB(min, max)
}

export class Mesh {
  vertexData: Float32Array = new Float32Array()
  indices: Uint32Array = new Uint32Array()
  vbo: WebGLBuffer
  ibo: WebGLBuffer
  layout: VertexLayout
  vertexCount: number = 0
  aabb: AABB
  primitive: MeshPrimitive

  constructor(
    data: ModelData,
    gl: WebGL2RenderingContext,
    primitive: MeshPrimitive = gl.TRIANGLES
  ) {
    this.indices = new Uint32Array(data.indices)
    this.layout = pos3norm3
    this.vertexCount = data.vertices.length / 3
    const normals = data.normals ?? new Array(this.vertexCount * 3).fill(0)

    if (normals.length !== this.vertexCount * 3) {
      throw new Error('Invalid normals length for mesh')
    }

    this.primitive = primitive
    //[px, py, pz, nx, ny, nz, ...] ->data layout
    this.vertexData = new Float32Array(this.vertexCount * 6)
    for (let i = 0; i < this.vertexCount; i++) {
      // Position
      this.vertexData[i * 6] = data.vertices[i * 3]
      this.vertexData[i * 6 + 1] = data.vertices[i * 3 + 1]
      this.vertexData[i * 6 + 2] = data.vertices[i * 3 + 2]
      // Normal
      this.vertexData[i * 6 + 3] = normals[i * 3]
      this.vertexData[i * 6 + 4] = normals[i * 3 + 1]
      this.vertexData[i * 6 + 5] = normals[i * 3 + 2]
    }

    this.aabb = createAABBFromVertices(data.vertices)

    // Create buffers
    this.vbo = gl.createBuffer() as WebGLBuffer
    this.ibo = gl.createBuffer() as WebGLBuffer

    // Upload index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW)

    // Upload interleaved vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW)
  }

  static createAABBWireframe(aabb: AABB, gl: WebGL2RenderingContext): Mesh {
    const wireframeData = createAABBWireframeData(aabb)
    return new Mesh(wireframeData, gl, gl.LINES)
  }

  bind(gl: WebGL2RenderingContext): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo)

    for (const attr of this.layout.attributes) {
      gl.enableVertexAttribArray(attr.location)
      gl.vertexAttribPointer(
        attr.location,
        attr.size,
        attr.type,
        attr.normalized,
        this.layout.stride,
        attr.offset
      )
    }
  }

  draw(gl: WebGL2RenderingContext): void {
    if (this.primitive === gl.LINES) {
      gl.lineWidth(4.0)
    }
    gl.drawElements(this.primitive, this.indices.length, gl.UNSIGNED_INT, 0)
  }
}
