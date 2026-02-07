import {gl, canvas} from "./context.js";
import {program} from "./shader.js";


const aspect = canvas.width / canvas.height;

gl.useProgram(program);

const vert = new Float32Array([
    -1, -1,
    1, -1,
    -1,  1,
    -1,  1,
    1, -1,
    1,  1,
]);

const buf = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);

const aPos = gl.getAttribLocation(program, "a_pos");
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

const uSize = gl.getUniformLocation(program, "u_size");
if (!uSize) throw new Error("u_size not found");

let  time = 0 ;
function render():void
{
    time += 0.01;
    gl.clearColor(0.2,0.2,0.2,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uSize,new Float32Array([aspect * Math.cos(time) * 0.5, Math.sin(time) * 0.5])[0], new Float32Array([aspect * Math.cos(time) * 0.5, Math.sin(time) * 0.5])[1]);
    gl.drawArrays(gl.TRIANGLES, 0, vert.length / 2)
    requestAnimationFrame(render);

}

render();