import { PhysicsCollider } from "../physics/physics";
import { Rigidbody } from "../physics/physics";
import { Transform } from "../graphics/transform";
import { Renderable } from "../graphics/renderable";

export interface Entity {
    transform : Transform ;
    renderable : Renderable | null ;
    physicsCollider : PhysicsCollider | null ;
    rigidbody : Rigidbody | null ;
}



