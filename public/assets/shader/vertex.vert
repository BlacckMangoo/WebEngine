#version 300 es

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_normal;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
out vec3 v_normal;
out vec3 v_world_pos;

void main() {
    v_world_pos = (u_model * vec4(a_pos, 1.0)).xyz;

    v_normal = mat3(u_model) * a_normal;

    gl_Position = u_projection * u_view * u_model * vec4(a_pos, 1.0);
}