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

export function cross(out: Vec3, a: Vec3, b: Vec3): void {
    const ax = a[0], ay = a[1], az = a[2];
    const bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
}

export function normalize(out: Vec3, a: Vec3): void {
    const x = a[0], y = a[1], z = a[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = x * len;
        out[1] = y * len;
        out[2] = z * len;
    }
}