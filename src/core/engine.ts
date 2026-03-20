import { Scene } from '../graphics/scene'
import { Renderer } from '@/src/graphics/renderer'
import { FixedStepClock } from '@/src/core/clock'
import { InputManager } from '@/src/inputSystem/inputManager'

class Engine {
  private static instance: Engine
  renderer = new Renderer()
  clock = new FixedStepClock(1 / 120)
  input = new InputManager()
  currScene?: Scene
  public createScene(): Scene {
    return new Scene(
    )
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
    requestAnimationFrame(() => this.gameloop())
  }
}

export default Engine
