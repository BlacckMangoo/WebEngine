import {Mesh} from "@/src/graphics/mesh";
import {Shader} from "@/src/graphics/shader";
import {Transform} from "@/src/graphics/transform";
import {Color} from "@/src/graphics/color";
import {allocVec3, Vec3} from "@/math/vec3";
import {allocMat4, identity, scale, rotate, translate} from "@/math/mat4";
import {gl} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";
import { PBRMaterial, isPBRMaterial } from "./pbrMaterial";
import { DirectionalLight, PointLight, MAX_POINT_LIGHTS } from "./light";



export interface Material {
    shader: Shader;
    color : Color ;
}

export type AnyMaterial = Material | PBRMaterial;

export class Renderable {
    mesh: Mesh;
    mat : AnyMaterial ;
    transform: Transform;

    private model = allocMat4();
    private temp = allocMat4();
    private view = allocMat4();
    private projection = allocMat4();
    private rotationAxis = allocVec3(0, 1, 0);

    constructor(
        mesh: Mesh,
        mat : AnyMaterial,
        transform: Transform,
    ) {
        this.mesh = mesh;
        this.mat  = mat;
        this.transform = transform;
}

    private updateModelMatrix(): void {
        // Model: M = T * R * S
        identity(this.model);
        translate(this.model, this.model, this.transform.position);
        const rotationAngle = this.transform.getRotationAxisAngle(this.rotationAxis);
        rotate(this.temp, this.model, rotationAngle, this.rotationAxis);
        scale(this.model, this.temp, this.transform.scaling);
    }

    draw(cam: Camera, dirLight?: DirectionalLight, pointLights?: PointLight[]): void {
        this.mat.shader.use();

        this.updateModelMatrix();

        cam.getViewMatrix(this.view);
        cam.getProjectionMatrix(this.projection);

        // Common uniforms
        this.mat.shader.setMat4("u_model", this.model);
        this.mat.shader.setMat4("u_view", this.view);
        this.mat.shader.setMat4("u_projection", this.projection);

        if (isPBRMaterial(this.mat)) {
            // PBR material uniforms
            this.mat.shader.setVec3("u_albedo", this.mat.albedo);
            this.mat.shader.setFloat("u_metallic", this.mat.metallic);
            this.mat.shader.setFloat("u_roughness", this.mat.roughness);
            this.mat.shader.setFloat("u_ao", this.mat.ao);
            this.mat.shader.setVec3("u_emissive", this.mat.emissive);

            // Camera position
            this.mat.shader.setVec3("u_cameraPos", cam.transform.position);

            // Directional light
            if (dirLight) {
                this.mat.shader.setVec3("u_lightDir", dirLight.direction);
                this.mat.shader.setVec3("u_lightColor", dirLight.color);
                this.mat.shader.setFloat("u_lightIntensity", dirLight.intensity);
            }

            // Point lights
            const lights = pointLights ?? [];
            const numLights = Math.min(lights.length, MAX_POINT_LIGHTS);
            this.mat.shader.setInt("u_numPointLights", numLights);

            const positions: Float32Array[] = [];
            const colors: Float32Array[] = [];
            const intensities: number[] = [];
            const radii: number[] = [];

            for (let i = 0; i < numLights; i++) {
                positions.push(lights[i].position);
                colors.push(lights[i].color);
                intensities.push(lights[i].intensity);
                radii.push(lights[i].radius);
            }

            this.mat.shader.setVec3Array("u_pointLightPositions", positions);
            this.mat.shader.setVec3Array("u_pointLightColors", colors);
            this.mat.shader.setFloatArray("u_pointLightIntensities", intensities);
            this.mat.shader.setFloatArray("u_pointLightRadii", radii);
        } else {
            // Legacy material
            const lightDir = allocVec3(1.0, 1.0, -1.0);
            const baseColor = allocVec3(this.mat.color.r, this.mat.color.g, this.mat.color.b);
            this.mat.shader.setVec3("u_light_dir", lightDir);
            this.mat.shader.setVec3("u_base_color", baseColor);
        }

        this.mesh.bind(gl);
        this.mesh.draw(gl);
    }
}

  

