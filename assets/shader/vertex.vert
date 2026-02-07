attribute vec2 a_pos;
uniform vec2 u_size;

void main() {
    gl_Position = vec4(a_pos * u_size, 0.0, 1.0);
}