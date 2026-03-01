import {gl, canvas} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";
import {Mesh} from "@/src/graphics/mesh";
import {Renderer} from "@/src/graphics/renderer";
import {Scene} from "@/src/graphics/scene";
import {Assets} from "@/src/assetManager";
import {Material, Renderable} from "@/src/graphics/renderable";
import {Transform} from "@/src/graphics/transform";
import {COLORS} from "@/src/graphics/color";
import {FixedStepClock} from "@/src/core/clock";
import {InputManager} from "@/src/inputSystem/inputManager";
import { PhysicsCollider, Rigidbody, RigidbodyType, simulatePhysics } from "./physics/physics";
import { allocVec3 } from "@/math/vec3";

// Scene setup
const scene = new Scene(new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4));
const renderer = new Renderer();
const clock = new FixedStepClock(1 / 120);
const input = new InputManager();

const buunyrb : Rigidbody = {
    type : RigidbodyType.Dynamic,
    mass : 1 ,
    restitution : 0.25,
    velocity : allocVec3(0, 0, 0) ,
    acceleration : allocVec3(0, 0, 0) ,
}

const groudnrb : Rigidbody = {
    type : RigidbodyType.Static,
    mass : 0 , // immovable object
    restitution : 0.25,
    velocity : allocVec3(0, 0, 0) ,
    acceleration : allocVec3(0, 0, 0) ,
}


const transformBunny: Transform = new Transform();
transformBunny.setTranslation(0, 0, 0);
transformBunny.setScale(1.5, 1.5, 1.5);

const bunnymat: Material = {
    shader: Assets.getShader("default"),
    color: COLORS.YELLOW,
}

const bunnyMesh = new Mesh(Assets.getModel("bunny"), gl);
const bunnyRenderable = new Renderable(bunnyMesh, bunnymat, transformBunny);

const bunnyEntity = {
    transform: transformBunny,
    renderable: bunnyRenderable,
    physicsCollider: {
        aabb: bunnyMesh.aabb,
        showDebug: true
    } as PhysicsCollider,
    rigidbody: buunyrb
}

scene.add(bunnyEntity);

const groundPlane = new Mesh(Assets.getModel("cube"), gl);
const groundTransform = new Transform().setScale(1, 0.1, 1).setTranslation(0, -1, 0);
const groundRenderable = new Renderable(groundPlane, bunnymat, groundTransform);

const groundEntity = {
    transform: groundTransform,
    renderable: groundRenderable,
    physicsCollider: {
        aabb: groundPlane.aabb,
        showDebug: false
    } as PhysicsCollider,
    rigidbody: groudnrb
}

scene.add(groundEntity);

function fixedUpdate(deltaTime: number): void {
    input.update();
    scene.camera.processInput(input, deltaTime);
    simulatePhysics(scene.entities, deltaTime);

}


function gameloop(): void {

    const steps = clock.tick();
    for (let i = 0; i < steps; i++) {
        fixedUpdate(clock.fixedDT);
    }

    renderer.render(scene, clock.elapsedTime);
    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);



