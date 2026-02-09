import {allocVec3, Vec3} from "@/math/vec3";

export class Transform {
    translation: Vec3 = allocVec3(0, 0, 0);
    scaling: Vec3 = allocVec3(1, 1, 1);
    rotAxis: Vec3 = allocVec3(0, 1, 0);
    rotAngle: number = 0;

    setTranslation(x: number, y: number, z: number): this {
        this.translation[0] = x;
        this.translation[1] = y;
        this.translation[2] = z;
        return this;
    }

    setScale(x: number, y: number, z: number): this {
        this.scaling[0] = x;
        this.scaling[1] = y;
        this.scaling[2] = z;
        return this;
    }

    setRotation(angle: number, axisX: number, axisY: number, axisZ: number): this {
        this.rotAngle = angle;
        this.rotAxis[0] = axisX;
        this.rotAxis[1] = axisY;
        this.rotAxis[2] = axisZ;
        return this;
    }

}

