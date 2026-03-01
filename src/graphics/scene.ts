import Camera from "@/src/graphics/camera";
import {Renderable} from "@/src/graphics/renderable";
import { Entity } from "../core/entity";
export class Scene {
    camera: Camera;

    entities: Entity[] = [];

    constructor(camera: Camera) {
        this.camera = camera;
    }

    add(entity: Entity): void {
        this.entities.push(entity);
    }

}

