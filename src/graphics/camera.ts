import {allocVec3, Vec3} from "@/math/vec3";
import {allocMat4, multiply, lookAt, perspective, translate, scale, rotate, identity, Mat4} from "@/math/mat4";

class Camera {

    //orientation parameters

     aspect : number  = 1 ;
     near : number  = 0.1 ;
     far : number  = 100 ;
     fovy : number = Math.PI/4;



     // projection parameters

     // Basis Vectors For Camera Coordinates
    // Modulus of these vectors should be 1, and they should be orthogonal to each other.

     position : Vec3  = allocVec3(0, 0, 2);
     right : Vec3 = allocVec3(1, 0, 0);
     up : Vec3 = allocVec3(0, 1, 0);
     forward : Vec3 = allocVec3(0, 0, -1);

     constructor(aspect : number, near : number, far : number,fovy : number) {
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.fovy = fovy;
     }

     public  getViewMatrix( view: Mat4 ): Mat4 {

         return lookAt(view,this.up, this.forward, this.position);
     }

     public getProjectionMatrix( projection: Mat4 ): Mat4 {
         return perspective(projection, this.fovy, this.aspect, this.near, this.far);
     }

}

export default Camera;

