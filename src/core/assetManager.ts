import { Shader } from '@/src/graphics/shader'
import { ModelData } from '@/src/graphics/mesh'
import horse from '@public/assets/models/horse.json'
import bunny from '@public/assets/models/stanfordbunny.json'
import { SHADERS } from '@/src/graphics/shaderSrc'

import {
  CUBE,
  CUBE_WIREFRAME,
  CYLINDER,
  GRID,
  GRID_CONFIG,
  SPHERE,
  SPHERE_WIREFRAME,
  QUAD,
  TRIANGLE,
  PYRAMID,
} from '@/src/graphics/primitives'
import { Material } from '../graphics/renderable'

class AssetManager {
  private static instance: AssetManager

  private shaders: Map<string, Shader> = new Map()
  private models: Map<string, ModelData> = new Map()
  private constructor() {}

  static getInstance(): AssetManager {
    if (AssetManager.instance == null) {
      AssetManager.instance = new AssetManager()
    }
    return AssetManager.instance
  }

  // Shader management
  registerShader(name: string, shader: Shader): void {
    if (this.shaders.has(name)) {
      console.warn(`Shader "${name}" already registered, overwriting.`)
    }
    this.shaders.set(name, shader)
  }

  getShader(name: string): Shader {
    const shader = this.shaders.get(name)
    if (!shader) {
      throw new Error(`Shader "${name}" not found in registry.`)
    }
    return shader
  }

  // Model management
  registerModel(name: string, model: ModelData): void {
    if (this.models.has(name)) {
      console.warn(`Model "${name}" already registered.`)
    }
    this.models.set(name, model)
  }

  getModel(name: string): ModelData {
    const model = this.models.get(name)
    if (!model) {
      throw new Error(`Model "${name}" not found in registry.`)
    }
    return model
  }

  getDefaultMaterial(): Material {
    return {
      color: { r: 0.9, g: 0.42, b: 0.22 },
      roughness: 0.33,
      metallic: 0.18,
      ao: 1.0,
    }
  }
}

//  singleton instance
export const Assets = AssetManager.getInstance()

// Register models from files
Assets.registerModel('horse', horse as ModelData)
Assets.registerModel('bunny', bunny as ModelData)

// Register primitive models
Assets.registerModel('cube', CUBE)
Assets.registerModel('cubeWireframe', CUBE_WIREFRAME)
Assets.registerModel('sphere', SPHERE)
Assets.registerModel('sphereWireframe', SPHERE_WIREFRAME)
Assets.registerModel('cylinder', CYLINDER)
Assets.registerModel('grid', GRID)
if (GRID_CONFIG.includeAxes && GRID_CONFIG.axisCylinder) {
  Assets.registerModel('gridAxisCylinder', GRID_CONFIG.axisCylinder)
}
Assets.registerModel('plane', QUAD)
Assets.registerModel('triangle', TRIANGLE)
Assets.registerModel('pyramid', PYRAMID)

// Register shaders
Assets.registerShader('default', new Shader(SHADERS.vertex, SHADERS.fragment))
Assets.registerShader('unlit', new Shader(SHADERS.unlitVertex, SHADERS.unlitFragment))
Assets.registerShader('skybox', new Shader(SHADERS.skyboxVertex, SHADERS.skyboxFragment))
