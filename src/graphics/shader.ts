import {gl} from "@/src/graphics/context";
import {SHADERS} from "@/src/graphics/shaderSrc";

export function compileShader(type: number, src: string): WebGLShader {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);

    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        throw new Error(gl!.getShaderInfoLog(s) ?? "Shader error");
    }
    return s;
}

export function createProgram ( vsrc: string, fsrc: string): WebGLProgram {
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

export class Shader {
    program: WebGLProgram;

    constructor(vsrc: string, fsrc: string) {
        this.program = createProgram(vsrc, fsrc);
    }

    use () {
        gl.useProgram(this.program);
    }

    setMat4(name: string, mat: Float32Array) {
        const loc = gl.getUniformLocation(this.program, name);
        if (loc === null) {
            console.warn(`Uniform ${name} not found`);
            return;
        }
        gl.uniformMatrix4fv(loc, false, mat);
    }

    setVec3(name: string, vec: Float32Array) {
        const loc = gl.getUniformLocation(this.program, name);
        if (loc === null) {
            console.warn(`Uniform ${name} not found`);
            return;
        }
        gl.uniform3fv(loc, vec);
    }

    setInt(name: string, value: number) {
        const loc = gl.getUniformLocation(this.program, name);
        if (loc === null) {
            console.warn(`Uniform ${name} not found`);
            return;
        }
        gl.uniform1i(loc, value);
    }

    setFloat(name: string, value: number) {
        const loc = gl.getUniformLocation(this.program, name);
        if (loc === null) {
            console.warn(`Uniform ${name} not found`);
            return;
        }
        gl.uniform1f(loc, value);
    }

    setVec3Array(name: string, values: Float32Array[]) {
        for (let i = 0; i < values.length; i++) {
            const loc = gl.getUniformLocation(this.program, `${name}[${i}]`);
            if (loc !== null) {
                gl.uniform3fv(loc, values[i]);
            }
        }
    }

    setFloatArray(name: string, values: number[]) {
        for (let i = 0; i < values.length; i++) {
            const loc = gl.getUniformLocation(this.program, `${name}[${i}]`);
            if (loc !== null) {
                gl.uniform1f(loc, values[i]);
            }
        }
    }

}

export const program = createProgram(SHADERS.vertex, SHADERS.fragment);



