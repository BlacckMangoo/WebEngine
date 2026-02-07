function create() {
    return new Float32Array(16);
}
export function allocMat4() {
    const out = create();
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}
// generates the view matrix.
// view matrix is the transformation matrix that transforms world space coordinates into
//camera space coordinates.
export function lookAt(out, right, up, forward, eye) {
    const a00 = right[0], a01 = right[1], a02 = right[2];
    const a10 = up[0], a11 = up[1], a12 = up[2];
    const a20 = -forward[0], a21 = -forward[1], a22 = -forward[2];
    const tx = -(a00 * eye[0] + a01 * eye[1] + a02 * eye[2]);
    const ty = -(a10 * eye[0] + a11 * eye[1] + a12 * eye[2]);
    const tz = -(a20 * eye[0] + a21 * eye[1] + a22 * eye[2]);
    out[0] = a00;
    out[1] = a10;
    out[2] = a20;
    out[3] = 0;
    out[4] = a01;
    out[5] = a11;
    out[6] = a21;
    out[7] = 0;
    out[8] = a02;
    out[9] = a12;
    out[10] = a22;
    out[11] = 0;
    out[12] = tx;
    out[13] = ty;
    out[14] = tz;
    out[15] = 1;
    return out;
}
export function perspective(out, fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
}
export function multiply(out, a, b) {
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
