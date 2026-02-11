import {allocMat4, translate, scale, rotate, identity} from "@/math/mat4";
import {allocVec3} from "@/math/vec3";
import Camera from "@/src/graphics/camera";
import {gl, canvas} from "@/src/graphics/context";
import {Scene} from "@/src/graphics/scene";
import {Renderable} from "@/src/graphics/renderable";
import {Transform} from "@/src/graphics/transform";
import {CubeMapTextures} from "@/src/graphics/cubemap";


export class Renderer {
    private view = allocMat4();
    private projection = allocMat4();
    private model = allocMat4();
    private temp = allocMat4();
    private initialized = false;

    private init(): void {
        if (this.initialized) return;
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.1, 0.1, 0.1, 1);
        this.initialized = true;
    }

    private updateMVP(camera: Camera, transform: Transform): void {
        // Get View and Projection matrices
        camera.getViewMatrix(this.view);
        camera.getProjectionMatrix(this.projection);

        // Model: M = T * R * S
        identity(this.model);
        scale(this.model, this.model, transform.scaling);
        rotate(this.temp, this.model, transform.rotAngle, transform.rotAxis);
        translate(this.model, this.temp, transform.translation);
    }

    private draw(camera: Camera, renderable: Renderable, time: number): void {
        this.updateMVP(camera, renderable.transform);
        renderable.mat.shader.use();

        // Pass matrices separately - let GPU do the multiplication
        renderable.mat.shader.setMat4("u_model", this.model);
        renderable.mat.shader.setMat4("u_view", this.view);
        renderable.mat.shader.setMat4("u_projection", this.projection);
        renderable.mat.shader.setVec3("u_camera_pos", camera.position);

        // Lighting uniforms
        const lightDir = allocVec3(Math.sin(time), 1.0, Math.cos(time));
        const baseColor = allocVec3(renderable.mat.color.r, renderable.mat.color.g, renderable.mat.color.b);
        renderable.mat.shader.setVec3("u_light_dir", lightDir);
        renderable.mat.shader.setVec3("u_base_color", baseColor);

        const cubemap = CubeMapTextures["skyBox"];
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);
            renderable.mat.shader.setInt("u_env_map", 0);

        renderable.mesh.bind(gl);
        renderable.mesh.draw(gl);
    }

    public render(scene: Scene, time: number): void {
        this.init();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const renderable of scene.renderables) {
            this.draw(scene.camera, renderable, time);
        }
    }

}
