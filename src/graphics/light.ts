import { Vec3 } from '@/math/vec3'
import { Color } from './color'

export enum LightType {
  Point = 'Point',
  Directional = 'Directional',
}

export interface Light {
  direction: Vec3
  color: Color
  intensity: number
}

export function createDirectionalLight(
  direction: Vec3,
  color: Color,
  intensity: number = 1.0
): Light {
  return {
    direction,
    color,
    intensity,
  }
}
