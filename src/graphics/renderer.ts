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

    this.view = scene.cam.getViewMatrix()
    this.projection = scene.cam.getProjectionMatrix()

    gl.depthFunc(gl.LEQUAL)
    gl.depthMask(false)
    scene.cam.skybox.draw(this.view, this.projection, scene.cam.getPosition())
    gl.depthMask(true)
    gl.depthFunc(gl.LESS)

    const lightDir = this.defaultLightDir;
    const cameraPos = scene.cam.getPosition()

    for (const entity of scene.entities) {
      if (entity.renderable) {
        const shader = entity.renderable.mat.shader
        shader.use()
        shader.setMat4('u_model', entity.transform.getModelMatrix())
        shader.setVec3('u_light_dir', lightDir)
        scene.cam.skybox.cubemap.bind(1)
        shader.setInt('u_skybox', 1)
        shader.setVec3('u_camera_pos', cameraPos)
        shader.setMat4('u_view', this.view)
        shader.setMat4('u_projection', this.projection)
        entity.renderable.draw()
      }
    }
  }
}