function create() {
    return new Float32Array(3);
}
export function allocVec3(a = 0, b = 0, c = 0) {
    const out = create();
    out[0] = a;
    out[1] = b;
    out[2] = c;
    return out;
}
export function setVec3(out, a, b, c) {
    out[0] = a;
    out[1] = b;
    out[2] = c;
}
