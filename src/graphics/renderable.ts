import { Mesh } from '@/src/graphics/mesh'
import { Shader } from '@/src/graphics/shader'
import { Transform } from '@/src/graphics/transform'
import { Color } from '@/src/graphics/color'
import { allocVec3 } from '@/math/vec3'
import { allocMat4, identity, scale, rotate, translate } from '@/math/mat4'
import { gl } from '@/src/graphics/context'
import Camera from '@/src/graphics/camera'
import { Light } from '@/src/graphics/light'

export interface Material {
  shader: Shader
  color: Color
}

export class Renderable {
  mesh: Mesh
  mat: Material
  transform: Transform

  private model = allocMat4()
  private temp = allocMat4()
  private view = allocMat4()
  private projection = allocMat4()
  private rotationAxis = allocVec3(0, 1, 0)

  constructor(mesh: Mesh, mat: Material, transform: Transform) {
    this.mesh = mesh
    this.mat = mat
    this.transform = transform
  }

  private updateModelMatrix(): void {
    // Model: M = T * R * S
    identity(this.model)
    translate(this.model, this.model, this.transform.position)
    const rotationAngle = this.transform.getRotationAxisAngle(this.rotationAxis)
    rotate(this.temp, this.model, rotationAngle, this.rotationAxis)
    scale(this.model, this.temp, this.transform.scaling)
  }

  draw(cam: Camera, dirLight?: Light): void {
    this.mat.shader.use()

    this.updateModelMatrix()

    cam.getViewMatrix(this.view)
    cam.getProjectionMatrix(this.projection)

    // Common uniforms
    this.mat.shader.setMat4('u_model', this.model)
    this.mat.shader.setMat4('u_view', this.view)
    this.mat.shader.setMat4('u_projection', this.projection)

    // Legacy material
    const baseColor = allocVec3(
      this.mat.color.r,
      this.mat.color.g,
      this.mat.color.b
    )
    this.mat.shader.setVec3(
      'u_light_dir',
      dirLight ? dirLight.direction : allocVec3(1, 1, 1)
    )
    this.mat.shader.setVec3('u_base_color', baseColor)

    this.mesh.bind(gl)
    this.mesh.draw(gl)
  }
}
