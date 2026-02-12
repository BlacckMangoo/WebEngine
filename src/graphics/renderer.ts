import {gl, canvas} from "@/src/graphics/context";
import {Scene} from "@/src/graphics/scene";


export class Renderer {

    private initialized = false;

    private init(): void {
        if (this.initialized) return;
        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0.1, 0.1, 0.1, 1);
        this.initialized = true;
    }

    public render(scene: Scene, time: number): void {
        this.init();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const renderable of scene.renderables) {
            renderable.draw(scene.camera);
        }
    }

}
