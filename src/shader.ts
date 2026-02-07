import {gl} from "./context.js";
import {SHADERS} from "./shaderSrc.js";

function compileShader(type: number, src: string): WebGLShader {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);

    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        throw new Error(gl!.getShaderInfoLog(s) ?? "Shader error");
    }
    return s;
}

function createProgram ( vsrc: string, fsrc: string): WebGLProgram {
    const vs = compileShader(gl.VERTEX_SHADER, vsrc);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsrc);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "Link error");
    }
    return program;
}

export const program = createProgram(SHADERS.vertex, SHADERS.fragment);



