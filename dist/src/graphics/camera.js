import { allocVec3 } from "../../math/vec3.js";
class Camera {
    //orientation parameters
    aspect = 1;
    near = 0.1;
    far = 100;
    fovy = Math.PI / 4;
    // projection parameters
    // Basis Vectors For Camera Coordinates
    // Modulus of these vectors should be 1, and they should be orthogonal to each other.
    position = allocVec3(0, 0, 5);
    right = allocVec3(1, 0, 0);
    up = allocVec3(0, 1, 0);
    forward = allocVec3(0, 0, -1);
    constructor(aspect, near, far, fovy) {
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.fovy = fovy;
    }
}
export default Camera;
