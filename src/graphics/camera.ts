import {
  allocVec3,
  Vec3,
  normalize,
  cross,
  scaleAndAdd,
  translateY,
} from '@/math/vec3'
import { lookAt, perspective, Mat4 } from '@/math/mat4'
import { InputManager } from '@/src/inputSystem/inputManager'
import { KeyCode } from '@/src/inputSystem/keycodes'
import { Transform } from './transform'

const FORWARD_REF: Vec3 = allocVec3(0, 0, -1)
const RIGHT_REF: Vec3 = allocVec3(1, 0, 0)

class Camera {
  // Projection parameters
  aspect: number = 1
  near: number = 0.1
  far: number = 100
  fovy: number = Math.PI / 4

  private forward: Vec3 = allocVec3(0, 0, -1)
  private right: Vec3 = allocVec3(1, 0, 0)
  private up: Vec3 = allocVec3(0, 1, 0)
  private viewTarget: Vec3 = allocVec3(0, 0, -1)

  transform: Transform = new Transform()

  private moveSpeed: number = 2.0
  private yaw: number = 0

  constructor(aspect: number, near: number, far: number, fovy: number) {
    this.aspect = aspect
    this.near = near
    this.far = far
    this.fovy = fovy
    this.transform.setRotation(this.yaw, 0, 1, 0)
    this.transform.setTranslation(0, 0, 5)
  }

  public getViewMatrix(view: Mat4): Mat4 {
    this.deriveBasisVectors()
    scaleAndAdd(this.viewTarget, this.transform.position, this.forward, 1)
    return lookAt(view, this.transform.position, this.viewTarget, this.up)
  }

  public getProjectionMatrix(projection: Mat4): Mat4 {
    return perspective(projection, this.fovy, this.aspect, this.near, this.far)
  }

  public processInput(input: InputManager, deltaTime: number): void {
    this.updateMovement(input, deltaTime)
  }

  private updateMovement(input: InputManager, deltaTime: number): void {
    const speed = this.moveSpeed * deltaTime
    this.deriveBasisVectors()

    // WASD movement
    if (input.isKeyPressed(KeyCode.W)) {
      scaleAndAdd(
        this.transform.position,
        this.transform.position,
        this.forward,
        speed
      )
    }
    if (input.isKeyPressed(KeyCode.S)) {
      scaleAndAdd(
        this.transform.position,
        this.transform.position,
        this.forward,
        -speed
      )
    }
    if (input.isKeyPressed(KeyCode.A)) {
      scaleAndAdd(
        this.transform.position,
        this.transform.position,
        this.right,
        -speed
      )
    }
    if (input.isKeyPressed(KeyCode.D)) {
      scaleAndAdd(
        this.transform.position,
        this.transform.position,
        this.right,
        speed
      )
    }

    if (input.isKeyPressed(KeyCode.ArrowUp)) {
      translateY(this.transform.position, speed)
    }
    if (input.isKeyPressed(KeyCode.ArrowDown)) {
      translateY(this.transform.position, -speed)
    }

    // rotate with arrow keys
    const rotSpeed = 1.5 * deltaTime
    if (input.isKeyPressed(KeyCode.ArrowLeft)) {
      this.yaw += rotSpeed
    }
    if (input.isKeyPressed(KeyCode.ArrowRight)) {
      this.yaw -= rotSpeed
    }

    this.transform.setRotation(this.yaw, 0, 1, 0)
  }

  private deriveBasisVectors(): void {
    this.transform.rotateVec3(this.forward, FORWARD_REF)
    this.transform.rotateVec3(this.right, RIGHT_REF)
    normalize(this.forward, this.forward)
    normalize(this.right, this.right)
    cross(this.up, this.right, this.forward)
    normalize(this.up, this.up)
  }
}

export default Camera
