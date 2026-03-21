import { Assets } from "../assetManager";
import { gl } from "./context";
import { Mesh, ModelData } from "./mesh";
import { Mat4 } from "@/math/mat4";
import { Shader } from "./shader";
import { SHADERS } from "./shaderSrc";
import { createCubemap, Cubemap } from "./cubemap";
import { allocVec3, Vec3 } from "@/math/vec3";
import { GetTransformMatrix } from "@/math/utils";
import { CubeMapName } from "./cubemapData";

class Skybox {

    mesh : Mesh ; 
    shader: Shader;
    cubemap: Cubemap;
    model: Mat4;

    constructor (cubemapName?: string ) {
        // cube mesh 
        const model = Assets.getModel('cube') as  ModelData;
        this.mesh = new Mesh(model, gl) ;
        this.shader = new Shader(SHADERS.skyboxVertex, SHADERS.skyboxFragment);
        this.cubemap = createCubemap(cubemapName as CubeMapName);
        this.model = GetTransformMatrix(allocVec3(0, 0, 0))
    }

    draw(view: Mat4, projection: Mat4, cameraPosition: Vec3): void {
        this.model = GetTransformMatrix(cameraPosition)
        this.shader.use();
        this.shader.setMat4('u_model', this.model);
        this.shader.setMat4('u_view', view);
        this.shader.setMat4('u_projection', projection);
        this.cubemap.bind(0);
        this.shader.setInt('u_skybox', 0);
        this.mesh.bind(gl);
        this.mesh.draw(gl);
    }
    
}

export default Skybox;