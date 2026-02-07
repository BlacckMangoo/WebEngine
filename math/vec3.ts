export type Vec3 = Float32Array & { length: 3 };

function create(): Vec3 {
    return new Float32Array(3) as Vec3;
}

export function allocVec3(a: number = 0, b: number = 0, c: number = 0): Vec3 {
    const out = create();
    out[0] = a;
    out[1] = b;
    out[2] = c;
    return out;
}

export function setVec3(out: Vec3, a: number, b: number, c: number): void {
    out[0] = a;
    out[1] = b;
    out[2] = c;
}