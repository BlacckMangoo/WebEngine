import { gl } from '@/src/graphics/context'

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
  uvs?: number[]
  indices: number[]
}

// Layout: position (3) + normal (3) + uv (2) = 8 floats * 4 bytes = 32 bytes stride
let pos3norm3uv2 = new VertexLayout(32, [
  { location: 0, size: 3, type: gl.FLOAT, normalized: false, offset: 0 },
  { location: 1, size: 3, type: gl.FLOAT, normalized: false, offset: 12 },
  { location: 2, size: 2, type: gl.FLOAT, normalized: false, offset: 24 },
])

function createFallbackUVs(vertices: number[], vertexCount: number): number[] {
  const uvs = new Array<number>(vertexCount * 2)
  for (let i = 0; i < vertexCount; i++) {
    uvs[i * 2] = vertices[i * 3] * 0.5 + 0.5
    uvs[i * 2 + 1] = vertices[i * 3 + 2] * 0.5 + 0.5
  }
  return uvs
}

export class Mesh {
  vertexData: Float32Array = new Float32Array()
  indices: Uint32Array = new Uint32Array()
  vbo: WebGLBuffer
  ibo: WebGLBuffer
  layout: VertexLayout
  vertexCount: number = 0
  primitive: MeshPrimitive

  constructor(
    data: ModelData,
    gl: WebGL2RenderingContext,
    primitive: MeshPrimitive = gl.TRIANGLES
  ) {
    this.indices = new Uint32Array(data.indices)
    this.layout = pos3norm3uv2
    this.vertexCount = data.vertices.length / 3
    const normals = data.normals ?? new Array(this.vertexCount * 3).fill(0)
    const uvs = data.uvs ?? createFallbackUVs(data.vertices, this.vertexCount)

    if (normals.length !== this.vertexCount * 3) {
      throw new Error('Invalid normals length for mesh')
    }
    if (uvs.length !== this.vertexCount * 2) {
      throw new Error('Invalid uvs length for mesh')
    }

    this.primitive = primitive
    //[px, py, pz, nx, ny, nz, u, v, ...] ->data layout
    this.vertexData = new Float32Array(this.vertexCount * 8)
    for (let i = 0; i < this.vertexCount; i++) {
      // Position
      this.vertexData[i * 8] = data.vertices[i * 3]
      this.vertexData[i * 8 + 1] = data.vertices[i * 3 + 1]
      this.vertexData[i * 8 + 2] = data.vertices[i * 3 + 2]
      // Normal
      this.vertexData[i * 8 + 3] = normals[i * 3]
      this.vertexData[i * 8 + 4] = normals[i * 3 + 1]
      this.vertexData[i * 8 + 5] = normals[i * 3 + 2]
      // UV
      this.vertexData[i * 8 + 6] = uvs[i * 2]
      this.vertexData[i * 8 + 7] = uvs[i * 2 + 1]
    }

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
