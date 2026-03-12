import { Mesh } from '@/src/graphics/mesh'
import { Shader } from '@/src/graphics/shader'
import { Transform } from '@/src/graphics/transform'
import { Color } from '@/src/graphics/color'
import { allocMat4, identity, scale, translate } from '@/math/mat4'
import { gl } from '@/src/graphics/context'

export interface Material {
  shader: Shader
  color: Color
}

export class Renderable {
  mesh: Mesh
  mat: Material
  transform: Transform

  private model = allocMat4()
  private baseColor = new Float32Array(3)

  constructor(mesh: Mesh, mat: Material, transform: Transform) {
    this.mesh = mesh
    this.mat = mat
    this.transform = transform
  }

  private updateModelMatrix(): void {
    // With rotation intentionally removed for now, the model transform is T * S.
    identity(this.model)
    translate(this.model, this.model, this.transform.position)
    scale(this.model, this.model, this.transform.scaling)
  }

  draw(): void {
    this.updateModelMatrix()

    this.mat.shader.setMat4('u_model', this.model)
    this.baseColor[0] = this.mat.color.r
    this.baseColor[1] = this.mat.color.g
    this.baseColor[2] = this.mat.color.b
    this.mat.shader.setVec3('u_base_color', this.baseColor)

    this.mesh.bind(gl)
    this.mesh.draw(gl)
  }
}
