import "./utils.js";
function create() {
    return new Float32Array(2);
}
export function allocVec2(a = 0, b = 0) {
    const out = create();
    out[0] = a;
    out[1] = b;
    return out;
}
export function set(out, a, b) {
    out[0] = a;
    out[1] = b;
}
// stores the result of a + b in out
export function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
}
export function sub(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
}
export function mul(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
}
export function div(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
}
