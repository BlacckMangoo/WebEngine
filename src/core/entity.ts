
import { Transform } from '../graphics/transform'
import { Renderable } from '../graphics/renderable'

export interface Entity {
  transform: Transform
  renderable?: Renderable 
}
