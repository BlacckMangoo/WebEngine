import { Mesh } from '@/src/graphics/mesh'
import { Shader } from '@/src/graphics/shader'
import { Color, colorToArray } from '@/src/graphics/color'
import { gl } from '@/src/graphics/context'

export interface Material {
  shader: Shader
  color: Color
}

export class Renderable {
  mesh: Mesh
  mat: Material
  private baseColor = new Float32Array(3)

  constructor(mesh: Mesh, mat: Material) {
    this.mesh = mesh
    this.mat = mat
  }

  draw(): void {
    
    colorToArray(this.mat.color, this.baseColor)
    this.mat.shader.setVec3('u_base_color', this.baseColor)
    this.mesh.bind(gl)
    this.mesh.draw(gl)
  }
}
