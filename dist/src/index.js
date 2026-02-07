import { gl, canvas } from "./context.js";
import { program } from "./shader.js";
import { allocVec2, set } from "../math/vec2.js";
const aspect = canvas.width / canvas.height;
gl.useProgram(program);
const vert = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
]);
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(program, "a_pos");
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
const uSize = gl.getUniformLocation(program, "u_size");
if (!uSize)
    throw new Error("u_size not found");
let time = 0;
const size = allocVec2();
const FIXED_DT = 1 / 120;
let accumulator = 0;
let lastTime = performance.now();
function Render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2fv(uSize, size);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
function FixedUpdate(dt) {
    time += dt;
    set(size, 0.5, 0.5 * aspect);
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
