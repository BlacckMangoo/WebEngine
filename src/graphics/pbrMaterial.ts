import { Vec3, allocVec3 } from "@/math/vec3";
import { Shader } from "./shader";

export interface PBRMaterial {
    shader: Shader;
    albedo: Vec3;
    metallic: number;
    roughness: number;
    ao: number;
    emissive: Vec3;
}

export interface PBRMaterialOptions {
    albedo?: [number, number, number];
    metallic?: number;
    roughness?: number;
    ao?: number;
    emissive?: [number, number, number];
}

export function createPBRMaterial(shader: Shader, options: PBRMaterialOptions = {}): PBRMaterial {
    return {
        shader,
        albedo: allocVec3(
            options.albedo?.[0] ?? 1.0,
            options.albedo?.[1] ?? 1.0,
            options.albedo?.[2] ?? 1.0
        ),
        metallic: options.metallic ?? 0.0,
        roughness: options.roughness ?? 0.5,
        ao: options.ao ?? 1.0,
        emissive: allocVec3(
            options.emissive?.[0] ?? 0.0,
            options.emissive?.[1] ?? 0.0,
            options.emissive?.[2] ?? 0.0
        ),
    };
}

export function isPBRMaterial(mat: unknown): mat is PBRMaterial {
    return (
        typeof mat === "object" &&
        mat !== null &&
        "albedo" in mat &&
        "metallic" in mat &&
        "roughness" in mat
    );
}
