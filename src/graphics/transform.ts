import { allocVec3, Vec3 } from '@/math/vec3'
import {
  allocQuaternion,
  composeQuaternion,
  quaternionFromAxisAngle,
  rotateVec3ByQuaternion,
  Quaternion,
  normalizeQuaternion,
} from '@/math/quaternion'
export class Transform {
  position: Vec3 = allocVec3(0, 0, 0)
  scaling: Vec3 = allocVec3(1, 1, 1)
  rotation: Quaternion = allocQuaternion(0, 0, 0, 1)
  // (x, y, z) imaginary part, w scalar part -> rotation axis is (x, y, z) and angle is 2 * acos(w)

  private revision = 0

  get version(): number {
    return this.revision
  }

  private markChanged(): void {
    this.revision++
  }

  setTranslation(x: number, y: number, z: number): this {
    this.position[0] = x
    this.position[1] = y
    this.position[2] = z
    this.markChanged()
    return this
  }

  translateBy(dx: number, dy: number, dz: number): this {
    this.position[0] += dx
    this.position[1] += dy
    this.position[2] += dz
    this.markChanged()
    return this
  }

  setScale(x: number, y: number, z: number): this {
    this.scaling[0] = x
    this.scaling[1] = y
    this.scaling[2] = z
    this.markChanged()
    return this
  }

  setRotation(
    angle: number,
    axisX: number,
    axisY: number,
    axisZ: number
  ): this {
    const axis = allocVec3(axisX, axisY, axisZ)
    const rotation = quaternionFromAxisAngle(axis, angle)
    this.rotation.imaginary[0] = rotation.imaginary[0]
    this.rotation.imaginary[1] = rotation.imaginary[1]
    this.rotation.imaginary[2] = rotation.imaginary[2]
    this.rotation.scalar = rotation.scalar
    normalizeQuaternion(this.rotation, this.rotation)
    this.markChanged()
    return this
  }

  rotateByAxisAngle(
    angle: number,
    axisX: number,
    axisY: number,
    axisZ: number
  ): this {
    const delta = quaternionFromAxisAngle(allocVec3(axisX, axisY, axisZ), angle)
    composeQuaternion(this.rotation, delta, this.rotation)
    this.markChanged()
    return this
  }

  rotateVec3(out: Vec3, v: Vec3): void {
    rotateVec3ByQuaternion(out, v, this.rotation)
  }

  getRotationAxisAngle(outAxis: Vec3): number {
    normalizeQuaternion(this.rotation, this.rotation)

    const w = Math.max(-1, Math.min(1, this.rotation.scalar))
    const angle = 2 * Math.acos(w)
    const s = Math.sqrt(1 - w * w)

    if (s < 1e-6) {
      outAxis[0] = 0
      outAxis[1] = 1
      outAxis[2] = 0
      return 0
    }

    outAxis[0] = this.rotation.imaginary[0] / s
    outAxis[1] = this.rotation.imaginary[1] / s
    outAxis[2] = this.rotation.imaginary[2] / s
    return angle
  }
}
