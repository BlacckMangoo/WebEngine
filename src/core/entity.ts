import { Renderable } from '../graphics/renderable'
import { CreateEntityOptions } from '../graphics/scene';
import { Shader } from '../graphics/shader';
import Transform from '../graphics/transform';


export class Entity {
  renderable?: Renderable  
  transform : Transform  

  constructor(entityOptions : CreateEntityOptions) {
    this.transform = new Transform()
    if (entityOptions.transform) {
      this.transform = entityOptions.transform
    }
  }
}
