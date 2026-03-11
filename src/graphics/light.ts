import { Vec3 } from '@/math/vec3'

export enum LightType {
  Point = 'Point',
  Directional = 'Directional',
}

export interface Light {
  direction: Vec3
  color: Vec3
  intensity: number
}

export function createDirectionalLight(
  direction: Vec3,
  color: Vec3,
  intensity: number = 1.0
): Light {
  return {
    direction,
    color,
    intensity,
  }
}
