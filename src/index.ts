import {gl, canvas} from "@/src/graphics/context";
import {program} from "@/src/graphics/shader";
import {allocVec2, setVec2, Vec2} from "@/math/vec2";
import {allocMat4, lookAt, multiply, perspective} from "@/math/mat4";
import Camera from "@/src/graphics/camera";
import {createCamParamsUI} from "@/src/camParamsUi";


import bunny from "@/assets/models/stanfordbunny.json";
import {allocVec3, setVec3} from "@/math/vec3";

const bunnyData = bunny as {
    vertices: number[];
    normals: number[];
    indices: number[];
};

const vertices = new Float32Array(bunnyData.vertices);
const normals = new Float32Array(bunnyData.normals);
const indices = new Uint32Array(bunnyData.indices);



const aspect = canvas.width / canvas.height;
const cam : Camera = new Camera(aspect, 0.1, 100, Math.PI / 4);

// Vertex buffer
const vbuf = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Normal buffer
const nbuf = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, nbuf);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

// Index buffer
const ibuf = gl.createBuffer()!;
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Position attribute
const aPos = gl.getAttribLocation(program, "a_pos");
if (aPos === -1) throw new Error("a_pos not found");
gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

// Normal attribute
const aNormal = gl.getAttribLocation(program, "a_normal");
if (aNormal === -1) throw new Error("a_normal not found");
gl.bindBuffer(gl.ARRAY_BUFFER, nbuf);
gl.enableVertexAttribArray(aNormal);
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);


const uSize = gl.getUniformLocation(program, "u_size");
if (!uSize) throw new Error("u_size not found");

const uMvp = gl.getUniformLocation(program, "u_mvp");
if (!uMvp) throw new Error("u_mvp not found");

const uLightDir = gl.getUniformLocation(program, "u_light_dir");
if (!uLightDir) throw new Error("u_light_dir not found");


let  time = 0 ;
const size = allocVec3();
const view = allocMat4();
const projection = allocMat4();
const model = allocMat4();
const mvp = allocMat4();


const camUI = createCamParamsUI(cam, view, projection, mvp);
const fixedDt = 1 / 120;
let accumulator = 0;
let lastTime = performance.now();


gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

function Render(): void {
    camUI.update();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(uMvp, false, mvp);
    gl.uniform3fv(uSize, size);
    gl.uniform3f(uLightDir, 0.5, 1.0, 0.3); // Light from top-right-front

    //wireframe mode

    gl.drawElements(
        gl.TRIANGLES,
        indices.length,
        gl.UNSIGNED_INT,
        0
    );
}

function FixedUpdate(dt: number): void {
    time += dt;
    setVec3(
        size,
        1,1,1
    );
}

function gameloop(now: number): void {
    let frameTime = (now - lastTime) / 1000;
    lastTime = now;
    if (frameTime > 0.25) frameTime = 0.25;
    accumulator += frameTime;

    while (accumulator >= fixedDt) {
        FixedUpdate(fixedDt);
        accumulator -= fixedDt;
    }
    Render();
    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);