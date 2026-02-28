import {Mesh} from "@/src/graphics/mesh";
import {Shader} from "@/src/graphics/shader";
import {Transform} from "@/src/graphics/transform";
import {Color} from "@/src/graphics/color";
import {allocVec3} from "@/math/vec3";
import {allocMat4, identity, scale, rotate, translate} from "@/math/mat4";
import {gl} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";


export interface Material {
    shader: Shader;
    color : Color ;
}


export class Renderable {
    mesh: Mesh;
    mat : Material ;
    transform: Transform;
    debugAABBMesh: Mesh | null = null;
    debugAABBColor: Color;


    private model = allocMat4();
    private temp = allocMat4();
    private view = allocMat4();
    private projection = allocMat4();


    constructor(
        mesh: Mesh,
        mat : Material,
        transform: Transform,
        options?: { debugAABB?: boolean; debugAABBColor?: Color }
    ) {
        this.mesh = mesh;
        this.mat  = mat;
        this.transform = transform;
        this.debugAABBColor = options?.debugAABBColor ?? mat.color;

        if (options?.debugAABB) {
            this.debugAABBMesh = Mesh.createAABBWireframe(this.mesh.aabb, gl);
        }
       

    }

    private updateModelMatrix(): void {
        // Model: M = T * R * S
        identity(this.model);
        scale(this.model, this.model, this.transform.scaling);
        rotate(this.temp, this.model, this.transform.rotAngle, this.transform.rotAxis);
        translate(this.model, this.temp, this.transform.translation);
    }

    draw(cam : Camera) : void {
        this.mat.shader.use();

        this.updateModelMatrix();

        cam.getViewMatrix(this.view);
        cam.getProjectionMatrix(this.projection);

        //set uniforms 

        this.mat.shader.setMat4("u_model", this.model);
        this.mat.shader.setMat4("u_view", this.view);
        this.mat.shader.setMat4("u_projection", this.projection);

        const lightDir = allocVec3(1.0, 1.0, -1.0);
        const baseColor = allocVec3(this.mat.color.r, this.mat.color.g, this.mat.color.b);
        this.mat.shader.setVec3("u_light_dir", lightDir);
        this.mat.shader.setVec3("u_base_color", baseColor);

        this.mesh.bind(gl);
        this.mesh.draw(gl);

        if (this.debugAABBMesh) {
            const debugColor = allocVec3(this.debugAABBColor.r, this.debugAABBColor.g, this.debugAABBColor.b);
            this.mat.shader.setVec3("u_base_color", debugColor);
            this.debugAABBMesh.bind(gl);
            this.debugAABBMesh.draw(gl);
        }


    }
}

