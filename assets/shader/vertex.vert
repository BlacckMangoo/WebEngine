attribute vec3 a_pos;
attribute vec3 a_normal;
uniform vec3 u_size;
uniform mat4 u_mvp;
varying vec3 v_normal;

void main() {
    v_normal = a_normal;
    gl_Position = u_mvp * vec4(a_pos * u_size, 1.0);
}