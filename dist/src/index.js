import { gl, canvas } from "./graphics/context.js";
import { program } from "./graphics/shader.js";
import { allocVec2, setVec2 } from "../math/vec2.js";
import { allocMat4 } from "../math/mat4.js";
import Camera from "./graphics/camera.js";
import { createCamParamsUI } from "./camParamsUi.js";
const aspect = canvas.width / canvas.height;
const cam = new Camera(aspect, 0.1, 100, Math.PI / 4);
gl.useProgram(program);
const vert = new Float32Array([
    -1, -1, 0,
    1, -1, 0,
    -1, 1, 0,
    -1, 1, 0,
    1, -1, 0,
    1, 1, 0,
]);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(program, "a_pos");
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
const uSize = gl.getUniformLocation(program, "u_size");
if (!uSize)
    throw new Error("u_size not found");
const uMvp = gl.getUniformLocation(program, "u_mvp");
if (!uMvp)
    throw new Error("u_mvp not found");
let time = 0;
const size = allocVec2();
const view = allocMat4();
const projection = allocMat4();
const model = allocMat4();
const mvp = allocMat4();
const camUI = createCamParamsUI(cam, view, projection, mvp);
const FIXED_DT = 1 / 120;
let accumulator = 0;
let lastTime = performance.now();
function Render() {
    // Update matrices from UI
    camUI.update();
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniformMatrix4fv(uMvp, false, mvp);
    gl.uniform2fv(uSize, size);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
function FixedUpdate(dt) {
    time += dt;
    setVec2(size, 0.5, 0.5);
}
function gameloop(now) {
    let frameTime = (now - lastTime) / 1000;
    lastTime = now;
    if (frameTime > 0.25)
        frameTime = 0.25;
    accumulator += frameTime;
    while (accumulator >= FIXED_DT) {
        FixedUpdate(FIXED_DT);
        accumulator -= FIXED_DT;
    }
    Render();
    requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);
