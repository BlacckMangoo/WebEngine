type Vec4 = Float32Array & { length: 4 };

function create(): Vec4 {
    return new Float32Array(4) as Vec4;
}

export function allocVec4(a: number = 0, b: number = 0, c: number = 0, d: number = 0): Vec4 {
    const out = create();
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
    return out;
}

export function setVec4(out: Vec4, a: number, b: number, c: number, d: number): void {
    out[0] = a;
    out[1] = b;
    out[2] = c;
    out[3] = d;
}