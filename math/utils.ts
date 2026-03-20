import { allocMat4, Mat4 } from "./mat4"
import { Vec3 } from "./vec3";

export function RadToDef(rad: number): number {
  return rad * (180 / Math.PI)
}

export function DegToRad(deg: number): number {
  return deg * (Math.PI / 180)
}


//Transformation Matrices 

export function GetTransformMatrix(position: Vec3): Mat4 {
  const Tmatrix = allocMat4();
  //when you alloc mat4 all the other values are set to 0 except the diagonal which is set to 1, so we only need to set the translation part
  Tmatrix[12] = position[0];
  Tmatrix[13] = position[1];
  Tmatrix[14] = position[2];
  return Tmatrix;
}

export function GetScaleMatrix(scale: Vec3): Mat4 {
  const Smatrix = allocMat4();
  //when you alloc mat4 all the other values are set to 0 except the diagonal which is set to 1, so we only need to set the scale part
  Smatrix[0] = scale[0];
  Smatrix[5] = scale[1];
  Smatrix[10] = scale[2];
  return Smatrix;
}