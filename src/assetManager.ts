import {Shader} from "@/src/graphics/shader";
import {ModelData} from "@/src/graphics/mesh";
import horse from "@/assets/models/horse.json";
import bunny from "@/assets/models/stanfordbunny.json";
import {SHADERS} from "@/src/graphics/shaderSrc";

class AssetManager {
    private static instance: AssetManager;

    private shaders: Map<string, Shader> = new Map();
    private models: Map<string, ModelData> = new Map();

    private constructor() {}

    static getInstance(): AssetManager {
        if (AssetManager.instance == null) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    // Shader management
    registerShader(name: string, shader: Shader): void {
        if (this.shaders.has(name)) {
            console.warn(`Shader "${name}" already registered, overwriting.`);
        }
        this.shaders.set(name, shader);
    }

    getShader(name: string): Shader {
        const shader = this.shaders.get(name);
        if (!shader) {
            throw new Error(`Shader "${name}" not found in registry.`);
        }
        return shader;
    }

    // Model management
    registerModel(name: string, model: ModelData): void {
        if (this.models.has(name)) {
            console.warn(`Model "${name}" already registered.`);
        }
        this.models.set(name, model);
    }

    getModel(name: string): ModelData {
        const model = this.models.get(name);
        if (!model) {
            throw new Error(`Model "${name}" not found in registry.`);
        }
        return model;
    }
}

//  singleton instance
export const Assets = AssetManager.getInstance();


Assets.registerModel("horse", horse as ModelData);
Assets.registerModel("bunny", bunny as ModelData);
Assets.registerShader("default", new Shader(SHADERS.vertex, SHADERS.fragment));
