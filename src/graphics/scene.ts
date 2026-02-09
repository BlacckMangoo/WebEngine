import Camera from "@/src/graphics/camera";
import {Renderable} from "@/src/graphics/renderable";

export class Scene {
    camera: Camera;
    renderables: Renderable[] = [];

    constructor(camera: Camera) {
        this.camera = camera;
    }

    add(renderable: Renderable): void {
        this.renderables.push(renderable);
    }

    remove(renderable: Renderable): void {
        const index = this.renderables.indexOf(renderable);
        if (index !== -1) {
            this.renderables.splice(index, 1);
        }
    }

    clear(): void {
        this.renderables = [];
    }
}

