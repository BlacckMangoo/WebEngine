import { allocVec3, Vec3 } from '@/math/vec3'
export class Transform {
  position: Vec3 = allocVec3(0, 0, 0)
  scaling: Vec3 = allocVec3(1, 1, 1)

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

}
