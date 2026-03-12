import { Scene } from '../graphics/scene'
import { canvas } from '@/src/graphics/context'
import Camera from '@/src/graphics/camera'
import { Renderer } from '@/src/graphics/renderer'
import { FixedStepClock } from '@/src/core/clock'
import { InputManager } from '@/src/inputSystem/inputManager'
import { simulatePhysics } from '@/src/physics/physics'

class Engine {
  private static instance: Engine
  renderer = new Renderer()
  clock = new FixedStepClock(1 / 120)
  input = new InputManager()
  currScene?: Scene
  public createScene(camera?: Camera): Scene {
    return new Scene(
      camera || new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4)
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
    this.input.update()
    this.currScene?.camera.processInput(this.input, deltaTime)
    simulatePhysics(this.currScene!.entities, deltaTime)
  }

  public gameloop(): void {
    const steps = this.clock.tick()
    for (let i = 0; i < steps; i++) {
      this.fixedUpdate(this.clock.fixedDT)
    }
    this.renderer.render(this.currScene!)
    //print fps 
    console.log(this.clock.fps);
    requestAnimationFrame(() => this.gameloop())
  }
}

export default Engine
