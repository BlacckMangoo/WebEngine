import { Scene } from '../graphics/scene'
import { Renderer } from '@/src/graphics/renderer'
import { FixedStepClock } from '@/src/core/clock'
import { InputManager } from '@/src/inputSystem/inputManager'
import { CubeMapName } from '../graphics/cubemapData'

class Engine {
  private static instance: Engine
  renderer = new Renderer()
  clock = new FixedStepClock(1 / 120)
  input = new InputManager()
  private fpsFrameCount = 0
  private fpsLastSampleTime = performance.now()
  currScene?: Scene
  public createScene(skyboxName?: CubeMapName): Scene {
    return new Scene(skyboxName);
  }

  setScene(scene: Scene): void {
    this.currScene = scene
  }

  static getInstance(): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine()
    }
    return Engine.instance
  }

  public fixedUpdate(deltaTime: number): void {
    void deltaTime
  }

  public gameloop(): void {

    if( this.currScene == null)
    {
      throw new Error("must create a scene to render");
    }

    // Input should be sampled once per rendered frame so mouse deltas are not reused.
    this.input.update()

    const steps = this.clock.tick()
    for (let i = 0; i < steps; i++) {
      this.fixedUpdate(this.clock.fixedDT)
    }
    const frameDT = Math.min(this.clock.frameDT, 0.05)
    this.currScene.cam.handleInput(this.input, frameDT)
    this.renderer.render(this.currScene!)

    this.fpsFrameCount++
    const now = performance.now()
    const elapsedMs = now - this.fpsLastSampleTime
    if (elapsedMs >= 1000) {
      const fps = (this.fpsFrameCount * 1000) / elapsedMs
      console.log(`FPS: ${fps.toFixed(1)}`)
      this.fpsFrameCount = 0
      this.fpsLastSampleTime = now
    }

    requestAnimationFrame(() => this.gameloop())
  }
}

export default Engine
