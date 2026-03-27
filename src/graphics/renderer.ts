import { gl, canvas } from '@/src/graphics/context'
import { Scene } from '@/src/graphics/scene'
import { allocMat4 } from '@/math/mat4'
import { allocVec3, normalize, setVec3 } from '@/math/vec3'
import { Assets } from '@/src/core/assetManager'

export class Renderer {
  private initialized = false
  
  private view = allocMat4()
  private projection = allocMat4()
  private defaultLightDir = allocVec3(0.62, 0.93, 0.28)
  private lightDirInput = allocVec3(0.62, 0.93, 0.28)

  public setLightDirection(x: number, y: number, z: number): void {
    if (x === 0 && y === 0 && z === 0) {
      setVec3(this.defaultLightDir, 0.62, 0.93, 0.28)
      return
    }

    setVec3(this.lightDirInput, x, y, z)
    normalize(this.lightDirInput, this.lightDirInput)
    setVec3(this.defaultLightDir, this.lightDirInput[0], this.lightDirInput[1], this.lightDirInput[2])
  }


  private beginFrame(): void {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LESS)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  }

  private updateCameraState(scene: Scene): void {
    this.view = scene.cam.getViewMatrix()
    this.projection = scene.cam.getProjectionMatrix()
  }

  private bindEnvironmentCubemap(scene: Scene): void {
    const envCubemap = scene.cam.skybox?.cubemap
    if (envCubemap && envCubemap.ready) {
      envCubemap.bind(0)
    }
  }

  private renderOpaquePass(scene: Scene): void {
    const lightDir = this.defaultLightDir
    const cameraPos = scene.cam.getPosition()
    this.bindEnvironmentCubemap(scene)
    const litShader = Assets.getShader('default')

    for (const entity of scene.entities) {
      if (entity.renderable && entity.renderable.mesh.primitive !== gl.LINES) {
        entity.renderable.draw(
          litShader,
          entity.transform.getModelMatrix(),
          this.view,
          this.projection,
          lightDir,
          cameraPos,
          0,
          false
        )
      }
    }
  }

  private renderLinePass(scene: Scene): void {
    const lightDir = this.defaultLightDir
    const cameraPos = scene.cam.getPosition()
    const unlitShader = Assets.getShader('unlit')

    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.depthMask(false)

    for (const entity of scene.entities) {
      if (entity.renderable && entity.renderable.mesh.primitive === gl.LINES) {
        entity.renderable.draw(
          unlitShader,
          entity.transform.getModelMatrix(),
          this.view,
          this.projection,
          lightDir,
          cameraPos,
          0,
          true
        )
      }
    }

    gl.depthMask(true)
    gl.disable(gl.BLEND)
    gl.depthFunc(gl.LESS)
  }

  private renderSkyboxPass(scene: Scene): void {
    gl.depthFunc(gl.LEQUAL)
    gl.depthMask(false)
    // Disable depth writes for skybox so it only renders in untouched far pixels.
    scene.cam.skybox?.draw(this.view, this.projection, scene.cam.getPosition())
    gl.depthMask(true)
    gl.depthFunc(gl.LESS)
  }



  private init(): void {
    if (this.initialized) return
    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0.1, 0.1, 0.1, 1)
    this.initialized = true
  }

  public render(scene: Scene): void {
    this.init()
    this.beginFrame()
    this.updateCameraState(scene)
    this.renderOpaquePass(scene)
    this.renderLinePass(scene)
    this.renderSkyboxPass(scene)
  }
}