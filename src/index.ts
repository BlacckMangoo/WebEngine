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
import {allocVec3} from "@/math/vec3";
import { PhysicsBody, PhysicsCollider, simulatePhysics } from "@/src/physics/physics";

// Scene setup
const scene = new Scene(new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4));
const renderer = new Renderer();
const clock = new FixedStepClock(1 / 120);
const input = new InputManager();

const transformBunny: Transform = new Transform();
transformBunny.setTranslation(0, 0, 0);
transformBunny.setScale(1.5, 1.5, 1.5);




const bunnymat: Material = {
    shader: Assets.getShader("default"),
    color: COLORS.YELLOW,
}

const bunnyMesh = new Mesh(Assets.getModel("bunny"), gl);
const bunnyRenderable = new Renderable(bunnyMesh, bunnymat, transformBunny);
scene.add(bunnyRenderable);
const bunnyBody = new PhysicsBody(
    transformBunny,
    new PhysicsCollider(bunnyMesh.aabb),
    {
        mass: 1,
        velocity: allocVec3(0, 0, 0),
        acceleration: allocVec3(0, -1.81, 0),
    }
);

const groundPlane = new Mesh(Assets.getModel("cube"), gl);
const groundTransform = new Transform().setScale(1, 0.1, 1).setTranslation(0, -1, 0);
const groundRenderable = new Renderable(groundPlane, bunnymat, groundTransform);
const groundBody = new PhysicsBody(
    groundTransform,
    new PhysicsCollider(groundPlane.aabb),
    {
        mass: 0,
        velocity: allocVec3(0, 0, 0),
        acceleration: allocVec3(0, 0, 0),
    }
);

const physicsBodies: PhysicsBody[] = [bunnyBody, groundBody];

scene.add(groundRenderable);




function fixedUpdate(deltaTime: number): void {
    input.update();
    scene.camera.processInput(input, deltaTime);
    simulatePhysics(physicsBodies, deltaTime, 3, 0.7);
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



