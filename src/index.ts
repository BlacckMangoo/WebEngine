import {gl, canvas} from "@/src/graphics/context";
import Camera from "@/src/graphics/camera";
import {Mesh, VertexLayout} from "@/src/graphics/mesh";
import {Renderer} from "@/src/graphics/renderer";
import {Scene} from "@/src/graphics/scene";
import {Assets} from "@/src/assetManager";
import {Material, Renderable} from "@/src/graphics/renderable";
import {InputManger} from "@/src/inputManager";
import {Transform} from "@/src/graphics/transform";
import {COLORS} from "@/src/graphics/color";
import {FixedStepClock} from "@/src/graphics/clock";


// Layout: position (3 floats) + normal (3 floats) = 6 floats * 4 bytes = 24 bytes stride
const posNormLayout = new VertexLayout(24, [
    {location: 0, size: 3, type: gl.FLOAT, normalized: false, offset: 0},
    {location: 1, size: 3, type: gl.FLOAT, normalized: false, offset: 12}
]);

const transformBunny : Transform = new Transform();
transformBunny.setTranslation( 1,2,-4);

const transformHorse : Transform  = new Transform();
transformHorse.setTranslation( 0,0,0);

const bunnymat : Material = {
    shader : Assets.getShader("default"),
    color : COLORS.RED,
}

const horsemat : Material = {
    shader : Assets.getShader("default"),
    color : COLORS.BLACK,
}

const scene = new Scene(new Camera(canvas.width / canvas.height, 0.1, 100, Math.PI / 4));

const horseMesh = new Mesh(Assets.getModel("horse"), gl, posNormLayout);
const horseRenderable = new Renderable(horseMesh,horsemat, transformHorse);

const bunnyMesh = new Mesh(Assets.getModel("bunny"), gl, posNormLayout);
const bunnyRenderable = new Renderable(bunnyMesh,bunnymat,transformBunny);


scene.add(horseRenderable);
scene.add(bunnyRenderable);

const renderer = new Renderer();
const clock = new FixedStepClock(1/60)

function fixedUpdate(deltaTime : number): void {
    InputManger.update();
    transformBunny.setTranslation( 1,2,-4 + Math.sin(clock.elapsedTime) );
}

function gameloop(): void {

    const  steps = clock.tick();
    for(let i = 0; i < steps; i++)
    {
        fixedUpdate(clock.fixedDT);
    }

    renderer.render(scene);
    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);