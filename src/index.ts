import { allocQuaternion } from '@/math/quaternion'
import { allocVec3 } from '@/math/vec3'
import { Assets } from '@/src/assetManager'
import Engine from '@/src/core/engine'
import Transform from './graphics/transform'

const engine = Engine.getInstance()
const scene = engine.createScene()

const bunnytransform = new Transform()
bunnytransform.setPosition(allocVec3(0, 0, -5))
bunnytransform.setOrientation(allocQuaternion(0, 0, 0, 0))


scene.createEntity({
  mesh: 'bunny',
  material: Assets.getDefaultMaterial(),
  transform : bunnytransform
})





engine.setScene(scene)

requestAnimationFrame(() => engine.gameloop())
