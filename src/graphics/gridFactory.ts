import { quaternionFromAxisAngle, rotateVec3ByQuaternion } from '@/math/quaternion'
import { allocVec3, Vec3 } from '@/math/vec3'
import { Assets } from '@/src/core/assetManager'
import { Scene } from './scene'
import Transform from './transform'
import { createGridPrimitive } from './primitives'
import { gl } from './context'

const GRID_MODEL_NAME = 'grid_runtime'
const GRID_AXIS_MODEL_NAME = 'grid_axis_runtime'

export function createGrid(
  scene: Scene,
  where: Vec3,
  size: number,
  includeAxes: boolean
): void {
  const safeSize = Math.max(1, size)
  const cells = Math.max(2, Math.floor(safeSize * 2))
  const grid = createGridPrimitive(safeSize, safeSize, cells, includeAxes)

  Assets.registerModel(GRID_MODEL_NAME, grid.grid)
  if (includeAxes && grid.axisCylinder) {
    Assets.registerModel(GRID_AXIS_MODEL_NAME, grid.axisCylinder)
  }

  const gridTransform = new Transform(where)

  const gridMat = Assets.getDefaultMaterial()
  gridMat.color = { r: 1.0, g: 1.0, b: 1.0 }
  gridMat.alpha = 0.1
  gridMat.roughness = 1.0
  gridMat.metallic = 0.0
  gridMat.ao = 1.0

  scene.createEntity({
    mesh: GRID_MODEL_NAME,
    transform: gridTransform,
    material: gridMat,
    primitive: gl.LINES,
  })

  if (!includeAxes || !grid.axisCylinder) {
    return
  }

  const tipHeight = Math.max(0.25, safeSize * 0.08)
  const tipRadius = tipHeight * 0.35

  for (const axis of grid.axisDefinitions) {
    const rotation = quaternionFromAxisAngle(
      allocVec3(axis.rotationAxis[0], axis.rotationAxis[1], axis.rotationAxis[2]),
      axis.angle
    )

    const axisTransform = new Transform(where)
    axisTransform.setOrientation(rotation)

    const axisMat = Assets.getDefaultMaterial()
    axisMat.color = axis.color
    axisMat.roughness = 0.45
    axisMat.metallic = 0.1
    axisMat.ao = 1.0

    scene.createEntity({
      mesh: GRID_AXIS_MODEL_NAME,
      transform: axisTransform,
      material: axisMat,
    })

    const axisDir = allocVec3(0, 0, 0)
    rotateVec3ByQuaternion(axisDir, allocVec3(0, 1, 0), rotation)
    const axisEndOffset = grid.axisLength * 0.5 + tipHeight * 0.5

    const tipTransform = new Transform(
      where[0] + axisDir[0] * axisEndOffset,
      where[1] + axisDir[1] * axisEndOffset,
      where[2] + axisDir[2] * axisEndOffset
    )
    tipTransform.scale[0] = tipRadius
    tipTransform.scale[1] = tipHeight
    tipTransform.scale[2] = tipRadius
    tipTransform.setOrientation(rotation)

    const tipMat = Assets.getDefaultMaterial()
    tipMat.color = axis.color
    tipMat.roughness = 0.35
    tipMat.metallic = 0.1
    tipMat.ao = 1.0

    scene.createEntity({
      mesh: 'pyramid',
      transform: tipTransform,
      material: tipMat,
    })
  }
}
