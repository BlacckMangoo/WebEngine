import { Vec3, allocVec3 } from "@/math/vec3";

export enum LightType {
    Point = "Point",
    Directional = "Directional",
}

export interface PointLight {
    type: LightType.Point;
    position: Vec3;
    color: Vec3;
    intensity: number;
    radius: number;
}

export interface DirectionalLight {
    type: LightType.Directional;
    direction: Vec3;
    color: Vec3;
    intensity: number;
}

export type Light = PointLight | DirectionalLight;

export function createPointLight(
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
    intensity: number = 1.0,
    radius: number = 10.0
): PointLight {
    return {
        type: LightType.Point,
        position: allocVec3(x, y, z),
        color: allocVec3(r, g, b),
        intensity,
        radius,
    };
}

export function createDirectionalLight(
    dirX: number,
    dirY: number,
    dirZ: number,
    r: number,
    g: number,
    b: number,
    intensity: number = 1.0
): DirectionalLight {
    return {
        type: LightType.Directional,
        direction: allocVec3(dirX, dirY, dirZ),
        color: allocVec3(r, g, b),
        intensity,
    };
}

export const MAX_POINT_LIGHTS = 4;
