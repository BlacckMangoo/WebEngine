import {canvas} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";
import {Renderer} from "@/src/graphics/renderer";
import {Scene} from "@/src/graphics/scene";
import {Assets} from "@/src/assetManager";
import {FixedStepClock} from "@/src/core/clock";
import {InputManager} from "@/src/inputSystem/inputManager";
import { RigidbodyType, simulatePhysics } from "./physics/physics";
import { createEntity, makeRigidbody } from "./factories/entityFactory";
import { createPBRMaterial } from "./graphics/pbrMaterial";
import { createDirectionalLight, createPointLight } from "./graphics/light";

const scene = new Scene(new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4));
const renderer = new Renderer();
const clock = new FixedStepClock(1 / 120);
const input = new InputManager();

scene.camera.transform.setTranslation(0, 2.5, 9);

// Setup lighting
scene.setDirectionalLight(createDirectionalLight(0.5, -1, 0.3, 1, 0.95, 0.9, 1.5));
scene.addPointLight(createPointLight(0, 3, 2, 1, 0.8, 0.6, 4, 15));
scene.addPointLight(createPointLight(-3, 1, 0, 0.4, 0.6, 1, 2, 10));

const pbrShader = Assets.getShader("pbr");

const mats = {
    ground: createPBRMaterial(pbrShader, { albedo: [0.2, 0.5, 0.2], metallic: 0.0, roughness: 0.8 }),
    wall: createPBRMaterial(pbrShader, { albedo: [0.3, 0.4, 0.7], metallic: 0.1, roughness: 0.6 }),
    bunny: createPBRMaterial(pbrShader, { albedo: [0.9, 0.75, 0.3], metallic: 0.7, roughness: 0.25 }),
    horse: createPBRMaterial(pbrShader, { albedo: [0.8, 0.3, 0.5], metallic: 0.5, roughness: 0.4 }),
    cubeA: createPBRMaterial(pbrShader, { albedo: [0.2, 0.7, 0.8], metallic: 0.9, roughness: 0.1 }),
    cubeB: createPBRMaterial(pbrShader, { albedo: [0.9, 0.2, 0.2], metallic: 0.0, roughness: 0.5 }),
};

const ground = createEntity({
    mesh: "cube",
    material: mats.ground,
    position: [0, -2.2, 0],
    scale: [10, 0.3, 10],
    rigidbody: makeRigidbody(RigidbodyType.Static, 1, 0.2),
    collider: true,
    colliderDebug: false,
});

const leftWall = createEntity({
    mesh: "cube",
    material: mats.wall,
    position: [-4.5, -0.3, 0],
    scale: [0.35, 2.5, 10],
    rigidbody: makeRigidbody(RigidbodyType.Static, 1, 0.2),
    collider: true,
    colliderDebug: false,
});

const rightWall = createEntity({
    mesh: "cube",
    material: mats.wall,
    position: [4.5, -0.3, 0],
    scale: [0.35, 2.5, 10],
    rigidbody: makeRigidbody(RigidbodyType.Static, 1, 0.2),
    collider: true,
    colliderDebug: false,
});

const bunny = createEntity({
    mesh: "bunny",
    material: mats.bunny,
    position: [-2.0, 1.8, 0],
    scale: [7.1, 7.1, 7.1],
    rigidbody: makeRigidbody(RigidbodyType.Dynamic, 2.0, 0.35, 1.1, 0, 0),
    collider: true,
    colliderDebug: true,
});


scene.add(ground);
scene.add(leftWall);
scene.add(rightWall);
scene.add(bunny);


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



