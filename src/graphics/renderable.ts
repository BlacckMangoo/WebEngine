import {Mesh} from "@/src/graphics/mesh";
import {Shader} from "@/src/graphics/shader";
import {Transform} from "@/src/graphics/transform";
import {Color} from "@/src/graphics/color";
import {allocVec3} from "@/math/vec3";
import {allocMat4, identity, scale, rotate, translate} from "@/math/mat4";
import {CubeMapTextures} from "@/src/graphics/cubemap";
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

    private model = allocMat4();
    private temp = allocMat4();
    private view = allocMat4();
    private projection = allocMat4();

    constructor(mesh: Mesh, mat : Material ,transform: Transform ) {
        this.mesh = mesh;
        this.mat  = mat;
        this.transform = transform;
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

        // Update model matrix from transform
        this.updateModelMatrix();

        // Get view and projection from camera
        cam.getViewMatrix(this.view);
        cam.getProjectionMatrix(this.projection);

        // Pass matrices separately - let GPU do the multiplication
        this.mat.shader.setMat4("u_model", this.model);
        this.mat.shader.setMat4("u_view", this.view);
        this.mat.shader.setMat4("u_projection", this.projection);
        this.mat.shader.setVec3("u_camera_pos", cam.position);

        // Lighting uniforms
        const lightDir = allocVec3(1.0, 1.0, -1.0);
        const baseColor = allocVec3(this.mat.color.r, this.mat.color.g, this.mat.color.b);
        this.mat.shader.setVec3("u_light_dir", lightDir);
        this.mat.shader.setVec3("u_base_color", baseColor);

        const cubemap = CubeMapTextures["skyBox"];
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);
        this.mat.shader.setInt("u_env_map", 0);

        this.mesh.bind(gl);
        this.mesh.draw(gl);
    }
}

