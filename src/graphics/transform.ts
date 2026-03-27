import { allocMat4, Mat4, multiply } from '@/math/mat4'
import {
  allocQuaternion,
  getRotationMatrix,
  Quaternion,
  setQuaternion,
} from '@/math/quaternion'
import { allocVec3, setVec3, Vec3 } from '@/math/vec3'

class Transform {
    position: Vec3 = allocVec3(0, 0, 0)
    scale: Vec3 = allocVec3(1, 1, 1)
    orientattion: Quaternion = allocQuaternion(0, 0, 0, 1)
    private readonly model = allocMat4()
    private readonly rotationmatrix = allocMat4()
    private readonly tmat = allocMat4()
    private readonly smat = allocMat4()
    private dirty = true

    constructor()
    constructor(pos: Vec3)
    constructor(x: number, y: number, z: number)
    constructor(xOrPos?: number | Vec3, y?: number, z?: number) {
        if (typeof xOrPos === 'number') {
            setVec3(this.position, xOrPos, y ?? 0, z ?? 0)
            return
        }

        if (xOrPos) {
            setVec3(this.position, xOrPos[0], xOrPos[1], xOrPos[2])
        }
    }

    setScale(scale: Vec3): void {
        setVec3(this.scale, scale[0], scale[1], scale[2])
        this.dirty = true
    }

    setPosition(pos: Vec3): void {
        setVec3(this.position, pos[0], pos[1], pos[2])
        this.dirty = true
    }

    setOrientation(orientation: Quaternion): void {
        setQuaternion(this.orientattion, orientation)
        this.dirty = true
    }

    private updateCachedModelMatrix(): void {
        this.tmat[0] = 1
        this.tmat[1] = 0
        this.tmat[2] = 0
        this.tmat[3] = 0
        this.tmat[4] = 0
        this.tmat[5] = 1
        this.tmat[6] = 0
        this.tmat[7] = 0
        this.tmat[8] = 0
        this.tmat[9] = 0
        this.tmat[10] = 1
        this.tmat[11] = 0
        this.tmat[12] = this.position[0]
        this.tmat[13] = this.position[1]
        this.tmat[14] = this.position[2]
        this.tmat[15] = 1

        this.smat[0] = this.scale[0]
        this.smat[1] = 0
        this.smat[2] = 0
        this.smat[3] = 0
        this.smat[4] = 0
        this.smat[5] = this.scale[1]
        this.smat[6] = 0
        this.smat[7] = 0
        this.smat[8] = 0
        this.smat[9] = 0
        this.smat[10] = this.scale[2]
        this.smat[11] = 0
        this.smat[12] = 0
        this.smat[13] = 0
        this.smat[14] = 0
        this.smat[15] = 1

        getRotationMatrix(this.rotationmatrix, this.orientattion)

        this.model[0] = 1
        this.model[1] = 0
        this.model[2] = 0
        this.model[3] = 0
        this.model[4] = 0
        this.model[5] = 1
        this.model[6] = 0
        this.model[7] = 0
        this.model[8] = 0
        this.model[9] = 0
        this.model[10] = 1
        this.model[11] = 0
        this.model[12] = 0
        this.model[13] = 0
        this.model[14] = 0
        this.model[15] = 1

        // Note: multiplication order is translation * rotation * scale.
        multiply(this.model, this.model, this.tmat)
        multiply(this.model, this.model, this.rotationmatrix)
        multiply(this.model, this.model, this.smat)
        this.dirty = false
    }

    getModelMatrix(): Mat4 {
        if (this.dirty) {
            this.updateCachedModelMatrix()
        }
        return this.model
    }

}

export default Transform