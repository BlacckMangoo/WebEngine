import { Assets } from '@/src/assetManager'
import { RigidbodyType } from './physics/physics'
import { createEntity, makeRigidbody } from './graphics/entityMaker'
import { createDirectionalLight } from './graphics/light'
import { allocVec3 } from '@/math/vec3'
import { Material } from './graphics/renderable'
import Engine from '@/src/core/engine'

const engine = Engine.getInstance()
const scene = engine.createScene()
const scene2 = engine.createScene()

scene.camera.transform.setTranslation(0, 2.5, 9)

// Setup lighting
scene.setDirectionalLight(
  createDirectionalLight(allocVec3(0.5, 1, 0.3), allocVec3(1, 0.95, 0.9), 1.5)
)

const shader = Assets.getShader('default')

const defaultMaterial: Material = {
  shader,
  color: { r: 0.8, g: 0.2, b: 0.2 },
}

const ground = createEntity({
  mesh: 'cube',
  material: defaultMaterial,
  position: [0, -2.2, 0],
  scale: [10, 0.3, 10],
  rigidbody: makeRigidbody(RigidbodyType.Static, 1, 0.5),
  collider: true,
  colliderDebug: false,
})

const sphere = createEntity({
  mesh: 'sphere',
  material: defaultMaterial,
  position: [0, 4, 0],
  scale: [2, 2, 2],
  rigidbody: makeRigidbody(RigidbodyType.Dynamic, 1.0, 0.6),
  collider: true,
  colliderDebug: true,
})

scene.add(ground)
scene.add(sphere)

scene2.add(ground)

engine.setScene(scene)

requestAnimationFrame(() => engine.gameloop())
