import { Assets } from '@/src/assetManager'
import Engine from '@/src/core/engine'

const engine = Engine.getInstance()
const scene = engine.createScene()
scene.camera.transform.setTranslation(-3, 2, 15)

scene.createEntity({
  mesh: 'cube',
  material: Assets.getDefaultMaterial(),
  position: [0, -2.2, 0],
  scale: [10, 0.3, 10]
})
scene.createEntity({
  mesh: 'cube',
  material: Assets.getDefaultMaterial(),
  position: [0, 2, 0],
  scale: [2, 2, 2]
})


engine.setScene(scene)

requestAnimationFrame(() => engine.gameloop())
