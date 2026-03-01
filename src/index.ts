import {gl, canvas} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";
import {Renderer} from "@/src/graphics/renderer";
import {Scene} from "@/src/graphics/scene";
import {Assets} from "@/src/assetManager";
import {Material} from "@/src/graphics/renderable";
import {COLORS} from "@/src/graphics/color";
import {FixedStepClock} from "@/src/core/clock";
import {InputManager} from "@/src/inputSystem/inputManager";
import { RigidbodyType, simulatePhysics } from "./physics/physics";
import { createEntity, makeRigidbody } from "./factories/entityFactory";

const scene = new Scene(new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4));
const renderer = new Renderer();
const clock = new FixedStepClock(1 / 120);
const input = new InputManager();

scene.camera.transform.setTranslation(0, 2.5, 9);

const defaultShader = Assets.getShader("default");

const mats = {
    ground: { shader: defaultShader, color: COLORS.GREEN } as Material,
    wall: { shader: defaultShader, color: COLORS.BLUE } as Material,
    bunny: { shader: defaultShader, color: COLORS.YELLOW } as Material,
    horse: { shader: defaultShader, color: COLORS.MAGENTA } as Material,
    cubeA: { shader: defaultShader, color: COLORS.CYAN } as Material,
    cubeB: { shader: defaultShader, color: COLORS.RED } as Material,
};

const ground = createEntity(
    "cube",
    mats.ground,
    0, -2.2, 0,
    10, 0.3, 10,
    makeRigidbody(RigidbodyType.Static, 1, 0.2),
    false
);

const leftWall = createEntity(
    "cube",
    mats.wall,
    -4.5, -0.3, 0,
    0.35, 2.5, 10,
    makeRigidbody(RigidbodyType.Static, 1, 0.2),
    false
);

const rightWall = createEntity(
    "cube",
    mats.wall,
    4.5, -0.3, 0,
    0.35, 2.5, 10,
    makeRigidbody(RigidbodyType.Static, 1, 0.2),
    false
);

const bunny = createEntity(
    "bunny",
    mats.bunny,
    -2.0, 1.8, 0,
    7.1, 7.1, 7.1,
    makeRigidbody(RigidbodyType.Dynamic, 2.0, 0.35, 1.1, 0, 0),
    true
)

const cubeTop = createEntity(
    "cube",
    mats.cubeA,
    0.0, 2.8, 0,
    0.55, 0.55, 0.55,
    makeRigidbody(RigidbodyType.Dynamic, 1.0, 0.6, 0.2, 0, 0),
    true
);



scene.add(ground);
scene.add(leftWall);
scene.add(rightWall);
scene.add(bunny);
scene.add(cubeTop);


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



