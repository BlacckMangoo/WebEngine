import { Mesh } from '@/src/graphics/mesh'
import { Shader } from '@/src/graphics/shader'
import { Color, colorToArray } from '@/src/graphics/color'
import { gl } from '@/src/graphics/context'
import { Mat4 } from '@/math/mat4'
import { Vec3 } from '@/math/vec3'

export interface Material {
  color: Color
  alpha?: number
  roughness?: number
  metallic?: number
  ao?: number
}

const tmpColor = new Float32Array(3)

function bindLitMaterial(shader: Shader, material: Material): void {
  colorToArray(material.color, tmpColor)
  shader.setVec3('u_albedo', tmpColor)
  shader.setFloat('u_roughness', material.roughness ?? 0.5)
  shader.setFloat('u_metallic', material.metallic ?? 0.0)
  shader.setFloat('u_ao', material.ao ?? 1.0)
}

function bindUnlitMaterial(shader: Shader, material: Material): void {
  colorToArray(material.color, tmpColor)
  shader.setVec3('u_color', tmpColor)
  shader.setFloat('u_alpha', material.alpha ?? 1.0)
}

export class Renderable {
  mesh: Mesh
  mat: Material

  constructor(mesh: Mesh, mat: Material) {
    this.mesh = mesh
    this.mat = mat
  }

  draw(
    shader: Shader,
    model: Mat4,
    view: Mat4,
    projection: Mat4,
    lightDir: Vec3,
    cameraPos: Vec3,
    skyboxUnit: number = 0,
    unlit: boolean = false
  ): void {
    shader.use()

    shader.setMat4('u_model', model)
    shader.setMat4('u_view', view)
    shader.setMat4('u_projection', projection)

    if (unlit) {
      bindUnlitMaterial(shader, this.mat)
    } else {
      shader.setVec3('u_light_dir', lightDir)
      shader.setVec3('u_camera_pos', cameraPos)
      shader.setInt('u_skybox', skyboxUnit)
      bindLitMaterial(shader, this.mat)
    }

    this.mesh.bind(gl)
    this.mesh.draw(gl)
  }
}
