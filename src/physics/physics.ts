import { Vec3,allocVec3, scaleAndAdd } from "@/math/vec3";
import { AABB ,aabbFromLocalToWorld} from "./aabb";
import { Entity } from "../core/entity";



// global physics properties
const gravity = allocVec3(0, -0.81, 0); // gravity vector in negative y direction


export interface Rigidbody {
    type : RigidbodyType ;
    mass : number ; 
    restitution : number ;
    velocity : Vec3 ;
    acceleration : Vec3 ;
}

export enum RigidbodyType {
    Dynamic = "Dynamic",
    Static = "Static"
}

export interface PhysicsCollider {
    aabb : AABB | null ;
    showDebug : boolean ;
}

function hasColliderAABB(entity: Entity): entity is Entity & { physicsCollider: PhysicsCollider & { aabb: AABB } } {
    return Boolean(entity.physicsCollider?.aabb);
}

function isDynamicBody(entity: Entity): entity is Entity & { rigidbody: Rigidbody } {
    return Boolean(entity.rigidbody && entity.rigidbody.type === RigidbodyType.Dynamic);
}

function getInvMass(entity: Entity): number {
    if (!isDynamicBody(entity) || entity.rigidbody.mass <= 0) {
        return 0;
    }

    return 1 / entity.rigidbody.mass;
}

function getRestitution(entity: Entity): number {
    if (!entity.rigidbody) {
        return 0;
    }

    return Math.max(0, Math.min(1, entity.rigidbody.restitution));
}

function getAABBCenter(aabb: AABB): Vec3 {
    return allocVec3(
        (aabb.min[0] + aabb.max[0]) * 0.5,
        (aabb.min[1] + aabb.max[1]) * 0.5,
        (aabb.min[2] + aabb.max[2]) * 0.5
    );
}

function getCollisionNormalAndPenetration(a: AABB, b: AABB): { normal: Vec3; penetration: number } | null {
    const overlapX = Math.min(a.max[0], b.max[0]) - Math.max(a.min[0], b.min[0]);
    const overlapY = Math.min(a.max[1], b.max[1]) - Math.max(a.min[1], b.min[1]);
    const overlapZ = Math.min(a.max[2], b.max[2]) - Math.max(a.min[2], b.min[2]);

    if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {
        return null;
    }

    const centerA = getAABBCenter(a);
    const centerB = getAABBCenter(b);

    let normal = allocVec3(1, 0, 0);
    let penetration = overlapX;

    if (overlapY < penetration) {
        normal = allocVec3(0, 1, 0);
        penetration = overlapY;
    }

    if (overlapZ < penetration) {
        normal = allocVec3(0, 0, 1);
        penetration = overlapZ;
    }

    if (normal[0] !== 0 && centerB[0] < centerA[0]) normal[0] = -1;
    if (normal[1] !== 0 && centerB[1] < centerA[1]) normal[1] = -1;
    if (normal[2] !== 0 && centerB[2] < centerA[2]) normal[2] = -1;

    return { normal, penetration };
}

function applyPositionalCorrection(entityA: Entity, entityB: Entity, normal: Vec3, penetration: number): void {
    const invMassA = getInvMass(entityA);
    const invMassB = getInvMass(entityB);
    const invMassSum = invMassA + invMassB;

    if (invMassSum <= 0) {
        return;
    }

    const slop = 0.001;
    const percent = 0.8;
    const correctionMag = Math.max(penetration - slop, 0) * percent / invMassSum;

    if (invMassA > 0) {
        entityA.transform.position[0] -= normal[0] * correctionMag * invMassA;
        entityA.transform.position[1] -= normal[1] * correctionMag * invMassA;
        entityA.transform.position[2] -= normal[2] * correctionMag * invMassA;
    }

    if (invMassB > 0) {
        entityB.transform.position[0] += normal[0] * correctionMag * invMassB;
        entityB.transform.position[1] += normal[1] * correctionMag * invMassB;
        entityB.transform.position[2] += normal[2] * correctionMag * invMassB;
    }
}

function applyImpulse(entityA: Entity, entityB: Entity, normal: Vec3): void {
    const invMassA = getInvMass(entityA);
    const invMassB = getInvMass(entityB);
    const invMassSum = invMassA + invMassB;

    if (invMassSum <= 0) {
        return;
    }

    const velocityA = entityA.rigidbody ? entityA.rigidbody.velocity : allocVec3(0, 0, 0);
    const velocityB = entityB.rigidbody ? entityB.rigidbody.velocity : allocVec3(0, 0, 0);

    const relativeVelocityX = velocityB[0] - velocityA[0];
    const relativeVelocityY = velocityB[1] - velocityA[1];
    const relativeVelocityZ = velocityB[2] - velocityA[2];
    const velocityAlongNormal =
        relativeVelocityX * normal[0] +
        relativeVelocityY * normal[1] +
        relativeVelocityZ * normal[2];

    if (velocityAlongNormal > 0) {
        return;
    }

    const restitution = Math.min(getRestitution(entityA), getRestitution(entityB));
    const impulseMagnitude = -(1 + restitution) * velocityAlongNormal / invMassSum;
    const impulseX = impulseMagnitude * normal[0];
    const impulseY = impulseMagnitude * normal[1];
    const impulseZ = impulseMagnitude * normal[2];

    if (isDynamicBody(entityA)) {
        entityA.rigidbody.velocity[0] -= impulseX * invMassA;
        entityA.rigidbody.velocity[1] -= impulseY * invMassA;
        entityA.rigidbody.velocity[2] -= impulseZ * invMassA;
    }

    if (isDynamicBody(entityB)) {
        entityB.rigidbody.velocity[0] += impulseX * invMassB;
        entityB.rigidbody.velocity[1] += impulseY * invMassB;
        entityB.rigidbody.velocity[2] += impulseZ * invMassB;
    }
}

function getWorldAABB(entity: Entity): AABB | null {
    if (!hasColliderAABB(entity)) {
        return null;
    }

    return aabbFromLocalToWorld(entity.physicsCollider.aabb, entity.transform);
}






function resolveCollision(entityA: Entity, entityB: Entity): void {
    const worldAABB = getWorldAABB(entityA);
    const worldBABB = getWorldAABB(entityB);

    if (!worldAABB || !worldBABB) {
        return;
    }

    if (!worldAABB.intersects(worldBABB)) {
        return;
    }

    const manifold = getCollisionNormalAndPenetration(worldAABB, worldBABB);
    if (!manifold) {
        return;
    }

    applyPositionalCorrection(entityA, entityB, manifold.normal, manifold.penetration);
    applyImpulse(entityA, entityB, manifold.normal);
}


function integrate( entity : Entity , deltaTime : number ) {
    // simple euler integration
    if (!isDynamicBody(entity)) {
        return;
    }

    // apply gravity
    //acceleration = gravity
    entity.rigidbody.acceleration[0] = gravity[0];
    entity.rigidbody.acceleration[1] = gravity[1];
    entity.rigidbody.acceleration[2] = gravity[2];
    // means : velocity += acceleration * deltaTime ;

    scaleAndAdd(entity.rigidbody.velocity, entity.rigidbody.velocity, entity.rigidbody.acceleration, deltaTime);
    //  position += velocity * deltaTime
    scaleAndAdd(entity.transform.position, entity.transform.position, entity.rigidbody.velocity, deltaTime);
}

export function simulatePhysics( entities : Entity[] , deltaTime : number ) {
    // simple physics simulation : apply gravity and check for collisions

    for (const entity of entities) {
        integrate(entity, deltaTime);
    }

    for( let i =0; i<entities.length; i++) {
        for( let j = i+1; j<entities.length; j++) {
            const entityA = entities[i];
            const entityB = entities[j];
           
          resolveCollision(entityA, entityB);
        
    }
}

}
