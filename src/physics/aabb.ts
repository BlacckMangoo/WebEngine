
import { Vec3 } from "@/math/vec3";

class AABB{
    constructor(public min : Vec3 , public max : Vec3 ){
        this.min = min;
        this.max = max;
    }

    intersects(other: AABB): boolean {
        return (this.min[0] <= other.max[0] && this.max[0] >= other.min[0]) &&
               (this.min[1] <= other.max[1] && this.max[1] >= other.min[1]) &&
               (this.min[2] <= other.max[2] && this.max[2] >= other.min[2]);
    }

}

export {AABB};