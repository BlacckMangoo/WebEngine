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
  indices: number[]
}

// Layout: position (3 floats) + normal (3 floats) = 6 floats * 4 bytes = 24 bytes stride
let pos3norm3 = new VertexLayout(24, [
  { location: 0, size: 3, type: gl.FLOAT, normalized: false, offset: 0 },
  { location: 1, size: 3, type: gl.FLOAT, normalized: false, offset: 12 },
])

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
