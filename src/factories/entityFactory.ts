import { allocVec3 } from "@/math/vec3";
import { Assets } from "@/src/assetManager";
import { Entity } from "@/src/core/entity";
import { Material, Renderable } from "@/src/graphics/renderable";
import { Mesh } from "@/src/graphics/mesh";
import { Transform } from "@/src/graphics/transform";
import { gl } from "@/src/graphics/context";
import { PhysicsCollider, Rigidbody, RigidbodyType } from "@/src/physics/physics";

export function makeRigidbody(type: RigidbodyType, mass: number, restitution: number, velocityX = 0, velocityY = 0, velocityZ = 0): Rigidbody {
    return {
        type,
        mass,
        restitution,
        velocity: allocVec3(velocityX, velocityY, velocityZ),
        acceleration: allocVec3(0, 0, 0),
    };
}

export function createEntity(
    modelName: string,
    material: Material,
    tx: number,
    ty: number,
    tz: number,
    sx: number,
    sy: number,
    sz: number,
    rigidbody: Rigidbody,
    showDebug: boolean
): Entity {
    const mesh = new Mesh(Assets.getModel(modelName), gl);
    const transform = new Transform().setTranslation(tx, ty, tz).setScale(sx, sy, sz);
    const renderable = new Renderable(mesh, material, transform);

    return {
        transform,
        renderable,
        physicsCollider: {
            aabb: mesh.aabb,
            showDebug,
        } as PhysicsCollider,
        rigidbody,
    };
}
