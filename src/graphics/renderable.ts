import {Mesh} from "@/src/graphics/mesh";
import {Shader} from "@/src/graphics/shader";
import {Transform} from "@/src/graphics/transform";
import {Color} from "@/src/graphics/color";


export interface Material {
    shader: Shader;
    color : Color ;
}


export class Renderable {
    mesh: Mesh;
    mat : Material ;
    transform: Transform;

    constructor(mesh: Mesh, mat : Material ,transform: Transform ) {
        this.mesh = mesh;
        this.mat  = mat;
        this.transform = transform;
    }
}

