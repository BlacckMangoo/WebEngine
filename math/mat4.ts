import {Vec2} from "./vec2.js";
import {Vec3} from "./vec3.js";
export type Mat4 = Float32Array & {length: 16};

function create(): Mat4 {
    return new Float32Array(16) as Mat4;
}

export function allocMat4(): Mat4{
    const out =  create();
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
}

export function identity(out: Mat4): Mat4 {
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
}


// generates the view matrix.
// view matrix is the transformation matrix that transforms world space coordinates into
//camera space coordinates.


export function lookAt(out :Mat4 , right : Vec3 , up : Vec3, forward : Vec3, eye: Vec3): Mat4 {
    const a00 = right[0], a01 = right[1], a02 = right[2];
    const a10 = up[0], a11 = up[1], a12 = up[2];
    const a20 = -forward[0], a21 = -forward[1], a22 = -forward[2];

    const tx = -(a00 * eye[0] + a01 * eye[1] + a02 * eye[2]);
    const ty = -(a10 * eye[0] + a11 * eye[1] + a12 * eye[2]);
    const tz = -(a20 * eye[0] + a21 * eye[1] + a22 * eye[2]);

    out[0] = a00; out[1] = a10; out[2] = a20; out[3] = 0;
    out[4] = a01; out[5] = a11; out[6] = a21; out[7] = 0;
    out[8] = a02; out[9] = a12; out[10] = a22; out[11] = 0;
    out[12] = tx; out[13] = ty; out[14] = tz; out[15] = 1;
    return out;
}

export function perspective(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);

        out[0] = f / aspect; out[1] = 0;   out[2] = 0;                       out[3] = 0;
        out[4] = 0;          out[5] = f;   out[6] = 0;                       out[7] = 0;
        out[8] = 0;          out[9] = 0;   out[10] = (far + near) * nf;      out[11] = -1;
        out[12] = 0;         out[13] = 0;  out[14] = (2 * far * near) * nf;  out[15] = 0;

    return out;
}

export function multiply(out: Mat4, a: Mat4, b: Mat4): Mat4 {

    // matrices in column major order, so a00 is first column, first row, a01 is second column, first row, etc.

    const a00 = a[0], a10 = a[1], a20 = a[2], a30 = a[3];
    const a01 = a[4], a11 = a[5], a21 = a[6], a31 = a[7];
    const a02 = a[8], a12 = a[9], a22 = a[10], a32 = a[11];
    const a03 = a[12], a13 = a[13], a23 = a[14], a33 = a[15];

    const b00 = b[0], b10 = b[1], b20 = b[2], b30 = b[3];
    const b01 = b[4], b11 = b[5], b21 = b[6], b31 = b[7];
    const b02 = b[8], b12 = b[9], b22 = b[10], b32 = b[11];
    const b03 = b[12], b13 = b[13], b23 = b[14], b33 = b[15];

    // Column 0
    out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    out[1] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    out[2] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    out[3] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;

    // Column 1
    out[4] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    out[6] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    out[7] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;

    // Column 2
    out[8] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    out[9] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    out[11] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;

    // Column 3
    out[12] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    out[13] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    out[14] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    return out;
}

// transform matrix

export function translate(out: Mat4, a: Mat4, v: Vec3): Mat4 {
    const x = v[0], y = v[1], z = v[2];

        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];

    return out;
}

export function scale(out: Mat4, a: Mat4, v: Vec3): Mat4 {
    const x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x; out[1] = a[1] * x; out[2] = a[2] * x; out[3] = a[3] * x;
    out[4] = a[4] * y; out[5] = a[5] * y; out[6] = a[6] * y; out[7] = a[7] * y;
    out[8] = a[8] * z; out[9] = a[9] * z; out[10] = a[10] * z; out[11] = a[11] * z;
    out[12] = a[12];   out[13] = a[13];   out[14] = a[14];     out[15] = a[15];
    return out;
}


export function rotate(out: Mat4, a: Mat4, rad: number, axis: Vec3): Mat4 {
    const x = axis[0], y = axis[1], z = axis[2];
    const len = Math.hypot(x, y, z);
    if (len < 1e-6) return null as any;

    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const t = 1 - c;

    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

    // normalize axis
    const rlen = 1 / len;
    const nx = x * rlen;
    const ny = y * rlen;
    const nz = z * rlen;

    // rotation matrix components
    const b00 = nx * nx * t + c;
    const b01 = ny * nx * t + nz * s;
    const b02 = nz * nx * t - ny * s;
    const b10 = nx * ny * t - nz * s;
    const b11 = ny * ny * t + c;
    const b12 = nz * ny * t + nx * s;
    const b20 = nx * nz * t + ny * s;
    const b21 = ny * nz * t - nx * s;
    const b22 = nz * nz * t + c;

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}





