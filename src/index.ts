import {gl, canvas} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";
import {VertexLayouts,Mesh} from "@/src/graphics/mesh";
import {Renderer} from "@/src/graphics/renderer";
import {Scene} from "@/src/graphics/scene";
import {Assets} from "@/src/assetManager";
import {Material, Renderable} from "@/src/graphics/renderable";
import {Transform} from "@/src/graphics/transform";
import {COLORS} from "@/src/graphics/color";
import {FixedStepClock} from "@/src/graphics/clock";
import {InputManager} from "@/src/inputSystem/inputManager";

// Scene setup
const scene = new Scene(new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4));
const renderer = new Renderer();
const clock = new FixedStepClock(1 / 120);
const input = new InputManager();

// Bunny (center)
const transformBunny: Transform = new Transform();
transformBunny.setTranslation(0, 0, 0);
transformBunny.setScale(1.5, 1.5, 1.5);

const bunnymat: Material = {
    shader: Assets.getShader("default"),
    color: COLORS.RED,
}

const bunnyMesh = new Mesh(Assets.getModel("bunny"), gl, VertexLayouts.posNormLayout);
const bunnyRenderable = new Renderable(bunnyMesh, bunnymat, transformBunny);
scene.add(bunnyRenderable);

// Cube (left)
const transformCube: Transform = new Transform();
transformCube.setTranslation(-1.5, 0, 0);
transformCube.setScale(0.8, 0.8, 0.8);

const cubeMat: Material = {
    shader: Assets.getShader("default"),
    color: COLORS.BLUE,
}

const cubeMesh = new Mesh(Assets.getModel("cube"), gl, VertexLayouts.posNormLayout);
const cubeRenderable = new Renderable(cubeMesh, cubeMat, transformCube);
scene.add(cubeRenderable);

// Pyramid (top right)
const transformPyramid: Transform = new Transform();
transformPyramid.setTranslation(1.5, 1, 0);
transformPyramid.setScale(0.8, 0.8, 0.8);

const pyramidMat: Material = {
    shader: Assets.getShader("default"),
    color: COLORS.MAGENTA,
}

const pyramidMesh = new Mesh(Assets.getModel("pyramid"), gl, VertexLayouts.posNormLayout);
const pyramidRenderable = new Renderable(pyramidMesh, pyramidMat, transformPyramid);
scene.add(pyramidRenderable);


function fixedUpdate(deltaTime: number): void {
    input.update();
    scene.camera.processInput(input, deltaTime);

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



