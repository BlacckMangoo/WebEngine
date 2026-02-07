import "./utils.js"

export type Vec2 = Float32Array & {length: 2};

 function create(): Vec2 {
    return new Float32Array(2) as Vec2;
}

export function allocVec2(a : number = 0, b : number = 0): Vec2 {
    const out = create();
    out[0] = a;
    out[1] = b;
    return out;
}

export function set(out: Vec2, a: number, b: number): void {
    out[0] = a;
    out[1] = b;
}


// stores the result of a + b in out

export function add(out: Vec2, a: Vec2, b: Vec2): void {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
}

export function sub(out: Vec2, a: Vec2, b: Vec2): void {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
}

export function mul(out: Vec2, a: Vec2, b: Vec2): void {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
}

export function div(out: Vec2, a: Vec2, b: Vec2): void {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
}