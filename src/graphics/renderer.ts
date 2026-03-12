import { gl, canvas } from '@/src/graphics/context'
import { Scene } from '@/src/graphics/scene'
import { allocMat4 } from '@/math/mat4'
import { allocVec3 } from '@/math/vec3'

export class Renderer {
  private initialized = false
  
  private view = allocMat4()
  private projection = allocMat4()
  private defaultLightDir = allocVec3(1, 1, 1)

  private init(): void {
    if (this.initialized) return
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.1, 0.1, 1)
    this.initialized = true
  }

  public render(scene: Scene): void {
    this.init()
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    scene.camera.getViewMatrix(this.view)
    scene.camera.getProjectionMatrix(this.projection)
    const lightDir = scene.directionalLight?.direction ?? this.defaultLightDir

    for (const entity of scene.entities) {
      if (entity.renderable) {
        const shader = entity.renderable.mat.shader
        shader.use()
        shader.setMat4('u_view', this.view)
        shader.setMat4('u_projection', this.projection)
        shader.setVec3('u_light_dir', lightDir)
        entity.renderable.draw()
      }
    }
  }
}