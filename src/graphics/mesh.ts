import { gl} from "@/src/graphics/context";
import {allocVec3, Vec3} from "@/math/vec3";

export interface MeshTransform {
    translation: Vec3;
    scaling: Vec3;
    rotAxis: Vec3;
    rotAngle: number;
}

export interface ModelData {
    vertices: number[];
    normals: number[];
    indices: number[];

}

export class  Mesh {
    vertices: Float32Array = new Float32Array();
    normals: Float32Array = new Float32Array();
    indices: Uint32Array = new Uint32Array();
    vbuf: WebGLBuffer = gl.createBuffer()!;
    nbuf: WebGLBuffer = gl.createBuffer()!;
    ibuf: WebGLBuffer = gl.createBuffer()!;
    meshTransform : MeshTransform = {
        translation: allocVec3(),
        scaling: allocVec3(1,1,1),
        rotAxis: allocVec3(),
        rotAngle: 0
    };
    constructor( data : ModelData ) {
        this.vertices = new Float32Array(data.vertices);
        this.normals = new Float32Array(data.normals);
        this.indices = new Uint32Array(data.indices);
    }
}