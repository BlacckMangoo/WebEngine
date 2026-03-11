import { Assets } from '@/src/assetManager'
import { RigidbodyType, makeRigidbody } from './physics/physics'
import { createDirectionalLight } from './graphics/light'
import { allocVec3 } from '@/math/vec3'
import Engine from '@/src/core/engine'

const engine = Engine.getInstance()
const scene = engine.createScene()
const light = createDirectionalLight(allocVec3(0.5, 1, 0.3), { r: 1, g: 1, b: 1 }, 1.5)
scene.camera.transform.setTranslation(0, 2.5, 9)
scene.setDirectionalLight(light)

scene.createEntity({
  mesh: 'cube',
  material: Assets.getDefaultMaterial(),
  position: [0, -2.2, 0],
  scale: [10, 0.3, 10],
  rigidbody: makeRigidbody(RigidbodyType.Static, 1, 0.5),
  collider: true,
  colliderDebug: false,
})
scene.createEntity({
  mesh: 'sphere',
  material: Assets.getDefaultMaterial(),
  position: [0, 4, 0],
  scale: [2, 2, 2],
  rigidbody: makeRigidbody(RigidbodyType.Dynamic, 1.0, 0.6),
  collider: true,
  colliderDebug: true,
})
engine.setScene(scene)

requestAnimationFrame(() => engine.gameloop())
