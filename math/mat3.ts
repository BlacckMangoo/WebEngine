type Mat3 = Float32Array & {length: 9};

export function allocMat3(): Mat3 {
    return new Float32Array(9) as Mat3;
}

export function identity(out: Mat3): Mat3 {
    out[0] = 1; out[1] = 0; out[2] = 0;
    out[3] = 0; out[4] = 1; out[5] = 0;
    out[6] = 0; out[7] = 0; out[8] = 1;
    return out;
}
