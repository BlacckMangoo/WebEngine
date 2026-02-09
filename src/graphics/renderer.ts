import {allocMat4, multiply, lookAt, perspective, translate, scale, rotate, identity, Mat4} from "@/math/mat4";
import Camera from "@/src/graphics/camera";
import {gl, canvas} from "@/src/graphics/context";
import {allocVec3} from "@/math/vec3";
import {Scene} from "@/src/graphics/scene";
import {Renderable} from "@/src/graphics/renderable";
import {Transform} from "@/src/graphics/transform";

export class Renderer {
    private view = allocMat4();
    private projection = allocMat4();
    private model = allocMat4();
    private mvp = allocMat4();
    private viewProj = allocMat4();
    private temp = allocMat4();
    private initialized = false;

    private init(): void {
        if (this.initialized) return;
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.1, 0.1, 0.1, 1);
        this.initialized = true;
    }

    private computeMVP(camera: Camera, transform: Transform): Mat4 {
        // View-Projection
        lookAt(this.view, camera.right, camera.up, camera.forward, camera.position);
        perspective(this.projection, camera.fovy, camera.aspect, camera.near, camera.far);
        multiply(this.viewProj, this.projection, this.view);

        // Model: M = T * R * S
        identity(this.model);
        scale(this.model, this.model, transform.scaling);
        rotate(this.temp, this.model, transform.rotAngle, transform.rotAxis);
        translate(this.model, this.temp, transform.translation);

        // MVP
        multiply(this.mvp, this.viewProj, this.model);
        return this.mvp;
    }

    private draw(camera: Camera, renderable: Renderable): void {
        const mvp = this.computeMVP(camera, renderable.transform);
        const color = allocVec3(renderable.mat.color.r, renderable.mat.color.g, renderable.mat.color.b);
        renderable.mat.shader.use();
        renderable.mat.shader.setMat4("u_mvp", mvp);
        renderable.mat.shader.setVec3("u_light_dir", allocVec3(0.5, 1, 0.5));
        renderable.mat.shader.setVec3("u_base_color",color);
        renderable.mesh.bind(gl);
        renderable.mesh.draw(gl);
    }

    public render(scene: Scene): void {
        this.init();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const renderable of scene.renderables) {
            this.draw(scene.camera, renderable);
        }
    }

}
