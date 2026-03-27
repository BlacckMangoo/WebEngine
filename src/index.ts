
import Engine from '@/src/core/engine'
import Transform from './graphics/transform'
import { gl } from './graphics/context'
import { createGrid } from './graphics/gridFactory'
import { allocVec3 } from '@/math/vec3'

const engine = Engine.getInstance()
const scene = engine.createScene()

scene.createEntity({
  mesh: 'cube',
  transform: new Transform(0, 0, -5),
})

scene.createEntity({
  mesh: 'cubeWireframe',
  transform: new Transform(2, 0, -5),
  primitive: gl.LINES,
})

createGrid(scene, allocVec3(0, -0.6, -5), 10, true)


engine.setScene(scene)

requestAnimationFrame(() => engine.gameloop())
