import {SHADERS} from "./shaders.js";

interface vec2 {
    x: number;
    y: number;
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const gl = canvas.getContext("webgl");
if (!gl) throw new Error("WebGL not supported");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const aspect = canvas.width / canvas.height;


gl.viewport(0, 0, canvas.width, canvas.height);

const vsSource = SHADERS.vertex;
const fsSource = SHADERS.fragment;

function compileShader(type: number, src: string): WebGLShader {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);

    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        throw new Error(gl!.getShaderInfoLog(s) ?? "Shader error");
    }
    return s;
}

const vs = compileShader(gl.VERTEX_SHADER, vsSource);
const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram()!;
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Link error");
}

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

let size : vec2 = {x: 0.2, y: 0.2};
let  time = 0 ;
function render():void
{
    time += 0.01;
    size = {x: 0.2 + Math.sin(time) * 0.1, y: (0.2 + Math.sin(time) * 0.1)*aspect};
    gl?.clearColor(0.2,0.2,0.2,1);
    gl?.clear(gl.COLOR_BUFFER_BIT);
    gl?.uniform2f(uSize, size.x,size.y);
    gl?.drawArrays(gl.TRIANGLES, 0, vert.length / 2)

    requestAnimationFrame(render);

}

render();