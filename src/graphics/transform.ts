import { allocMat4, Mat4, multiply } from "@/math/mat4";
import { allocQuaternion, getRotationMatrix, Quaternion, setQuaternion } from "@/math/quaternion";
import { allocVec3, setVec3, Vec3 } from "@/math/vec3";
import { GetTransformMatrix,GetScaleMatrix } from "@/math/utils";
class Transform {
    position :Vec3 = allocVec3(0, 0, 0)
    scale :Vec3 = allocVec3(1, 1, 1);
    orientattion : Quaternion = allocQuaternion(0, 0, 0, 1);

    setScale(scale: Vec3): void {  
        setVec3(this.scale, scale[0], scale[1], scale[2])
      }

    setPosition(pos: Vec3): void {
        setVec3(this.position, pos[0], pos[1], pos[2])
    }

    setOrientation(orientation: Quaternion): void {
        setQuaternion(this.orientattion, orientation)
    }


    getModelMatrix(): Mat4 {
        const model = allocMat4()
        const rotationmatrix = allocMat4()
        const tmat = GetTransformMatrix(this.position)
        const smat = GetScaleMatrix(this.scale)
        getRotationMatrix(rotationmatrix, this.orientattion)
        // Note: The order of multiplication is important
        multiply(model, model, tmat)
        multiply(model, model, rotationmatrix)
        multiply(model, model, smat)
        return model
    }
    

}

export default Transform;