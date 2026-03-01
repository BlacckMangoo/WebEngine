import Camera from "@/src/graphics/camera";
import {Renderable} from "@/src/graphics/renderable";
import { Entity } from "../core/entity";
import { Light, DirectionalLight, PointLight, LightType, createDirectionalLight } from "./light";

export class Scene {
    camera: Camera;
    entities: Entity[] = [];
    directionalLight: DirectionalLight;
    pointLights: PointLight[] = [];

    constructor(camera: Camera) {
        this.camera = camera;
        this.directionalLight = createDirectionalLight(-0.5, -1.0, -0.5, 1.0, 1.0, 1.0, 1.0);
    }

    add(entity: Entity): void {
        this.entities.push(entity);
    }

    addPointLight(light: PointLight): void {
        this.pointLights.push(light);
    }

    setDirectionalLight(light: DirectionalLight): void {
        this.directionalLight = light;
    }

}

