import { Vec3 } from "@/math/vec3";
import { AABB } from "./aabb";
import { Transform } from "../graphics/transform";
import { allocVec3 } from "@/math/vec3";


export interface Rigidbody {
    mass : number ; 
    velocity : Vec3 ;
    acceleration : Vec3 ;
}

export class PhysicsCollider {
    readonly localAABB: AABB;
    readonly worldAABB: AABB;

    private lastTransformVersion = -1;
    private readonly corner = allocVec3();

    constructor(localAABB: AABB) {
        this.localAABB = localAABB;
        this.worldAABB = new AABB(allocVec3(), allocVec3());
    }

    updateWorldAABB(transform: Transform): void {
        if (this.lastTransformVersion === transform.version) return;

        const minX = this.localAABB.min[0];
        const minY = this.localAABB.min[1];
        const minZ = this.localAABB.min[2];
        const maxX = this.localAABB.max[0];
        const maxY = this.localAABB.max[1];
        const maxZ = this.localAABB.max[2];

        let worldMinX = Number.POSITIVE_INFINITY;
        let worldMinY = Number.POSITIVE_INFINITY;
        let worldMinZ = Number.POSITIVE_INFINITY;
        let worldMaxX = Number.NEGATIVE_INFINITY;
        let worldMaxY = Number.NEGATIVE_INFINITY;
        let worldMaxZ = Number.NEGATIVE_INFINITY;

        transformAABBCornerToWorld(this.corner, transform, minX, minY, minZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, maxX, minY, minZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, minX, maxY, minZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, maxX, maxY, minZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, minX, minY, maxZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, maxX, minY, maxZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, minX, maxY, maxZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        transformAABBCornerToWorld(this.corner, transform, maxX, maxY, maxZ);
        if (this.corner[0] < worldMinX) worldMinX = this.corner[0];
        if (this.corner[1] < worldMinY) worldMinY = this.corner[1];
        if (this.corner[2] < worldMinZ) worldMinZ = this.corner[2];
        if (this.corner[0] > worldMaxX) worldMaxX = this.corner[0];
        if (this.corner[1] > worldMaxY) worldMaxY = this.corner[1];
        if (this.corner[2] > worldMaxZ) worldMaxZ = this.corner[2];

        this.worldAABB.min[0] = worldMinX;
        this.worldAABB.min[1] = worldMinY;
        this.worldAABB.min[2] = worldMinZ;
        this.worldAABB.max[0] = worldMaxX;
        this.worldAABB.max[1] = worldMaxY;
        this.worldAABB.max[2] = worldMaxZ;

        this.lastTransformVersion = transform.version;
    }
}

export class PhysicsBody {
    constructor(
        public transform: Transform,
        public collider: PhysicsCollider,
        public rigidbody: Rigidbody,
    ) {}

    integrate(deltaTime: number): void {
        this.rigidbody.velocity[0] += this.rigidbody.acceleration[0] * deltaTime;
        this.rigidbody.velocity[1] += this.rigidbody.acceleration[1] * deltaTime;
        this.rigidbody.velocity[2] += this.rigidbody.acceleration[2] * deltaTime;

        this.transform.translateBy(
            this.rigidbody.velocity[0] * deltaTime,
            this.rigidbody.velocity[1] * deltaTime,
            this.rigidbody.velocity[2] * deltaTime,
        );

        this.collider.updateWorldAABB(this.transform);
    }
}

function transformAABBCornerToWorld(
    out: Vec3,
    transform: Transform,
    x: number,
    y: number,
    z: number
): void {
    out[0] = x * transform.scaling[0];
    out[1] = y * transform.scaling[1];
    out[2] = z * transform.scaling[2];

    transform.rotateVec3(out, out);

    out[0] += transform.translation[0];
    out[1] += transform.translation[1];
    out[2] += transform.translation[2];
}

export function toWorldAABB(localAABB: AABB, transform: Transform): AABB {
    const collider = new PhysicsCollider(localAABB);
    collider.updateWorldAABB(transform);
    return collider.worldAABB;
}

export function detectBodyCollision(a: PhysicsBody, b: PhysicsBody): boolean {
    a.collider.updateWorldAABB(a.transform);
    b.collider.updateWorldAABB(b.transform);
    return a.collider.worldAABB.intersects(b.collider.worldAABB);
}

export function resolveBodyCollision(a: PhysicsBody, b: PhysicsBody, restitution: number = 1): boolean {
    a.collider.updateWorldAABB(a.transform);
    b.collider.updateWorldAABB(b.transform);

    const aabbA = a.collider.worldAABB;
    const aabbB = b.collider.worldAABB;
    if (!aabbA.intersects(aabbB)) return false;

    const overlapX = Math.min(aabbA.max[0], aabbB.max[0]) - Math.max(aabbA.min[0], aabbB.min[0]);
    const overlapY = Math.min(aabbA.max[1], aabbB.max[1]) - Math.max(aabbA.min[1], aabbB.min[1]);
    const overlapZ = Math.min(aabbA.max[2], aabbB.max[2]) - Math.max(aabbA.min[2], aabbB.min[2]);

    const centerAX = (aabbA.min[0] + aabbA.max[0]) * 0.5;
    const centerAY = (aabbA.min[1] + aabbA.max[1]) * 0.5;
    const centerAZ = (aabbA.min[2] + aabbA.max[2]) * 0.5;
    const centerBX = (aabbB.min[0] + aabbB.max[0]) * 0.5;
    const centerBY = (aabbB.min[1] + aabbB.max[1]) * 0.5;
    const centerBZ = (aabbB.min[2] + aabbB.max[2]) * 0.5;

    let normalX = 0;
    let normalY = 0;
    let normalZ = 0;
    let penetration = overlapX;

    if (overlapX <= overlapY && overlapX <= overlapZ) {
        normalX = centerBX >= centerAX ? 1 : -1;
        penetration = overlapX;
    } else if (overlapY <= overlapX && overlapY <= overlapZ) {
        normalY = centerBY >= centerAY ? 1 : -1;
        penetration = overlapY;
    } else {
        normalZ = centerBZ >= centerAZ ? 1 : -1;
        penetration = overlapZ;
    }

    const invMassA = a.rigidbody.mass > 0 ? 1 / a.rigidbody.mass : 0;
    const invMassB = b.rigidbody.mass > 0 ? 1 / b.rigidbody.mass : 0;
    const invMassSum = invMassA + invMassB;
    if (invMassSum <= 0) return true;

    const rvX = b.rigidbody.velocity[0] - a.rigidbody.velocity[0];
    const rvY = b.rigidbody.velocity[1] - a.rigidbody.velocity[1];
    const rvZ = b.rigidbody.velocity[2] - a.rigidbody.velocity[2];
    const velocityAlongNormal = rvX * normalX + rvY * normalY + rvZ * normalZ;

    if (velocityAlongNormal < 0) {
        const e = Math.max(0, Math.min(1, restitution));
        const impulseMagnitude = (-(1 + e) * velocityAlongNormal) / invMassSum;
        const impulseX = impulseMagnitude * normalX;
        const impulseY = impulseMagnitude * normalY;
        const impulseZ = impulseMagnitude * normalZ;

        a.rigidbody.velocity[0] -= impulseX * invMassA;
        a.rigidbody.velocity[1] -= impulseY * invMassA;
        a.rigidbody.velocity[2] -= impulseZ * invMassA;

        b.rigidbody.velocity[0] += impulseX * invMassB;
        b.rigidbody.velocity[1] += impulseY * invMassB;
        b.rigidbody.velocity[2] += impulseZ * invMassB;
    }

    const correctionX = (penetration * normalX) / invMassSum;
    const correctionY = (penetration * normalY) / invMassSum;
    const correctionZ = (penetration * normalZ) / invMassSum;

    a.transform.translateBy(-correctionX * invMassA, -correctionY * invMassA, -correctionZ * invMassA);
    b.transform.translateBy(correctionX * invMassB, correctionY * invMassB, correctionZ * invMassB);

    a.collider.updateWorldAABB(a.transform);
    b.collider.updateWorldAABB(b.transform);

    return true;
}

export function simulatePhysics(
    bodies: PhysicsBody[],
    deltaTime: number,
    solverIterations: number = 1,
    restitution: number = 1,
): void {
    for (const body of bodies) {
        body.integrate(deltaTime);
    }

    const count = bodies.length;
    for (let iteration = 0; iteration < solverIterations; iteration++) {
        for (let i = 0; i < count - 1; i++) {
            for (let j = i + 1; j < count; j++) {
                resolveBodyCollision(bodies[i], bodies[j], restitution);
            }
        }
    }
}

