#version 300 es

layout(location = 0) in vec3 a_pos;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_texcoord;

out vec2 v_texcoord ;

//MVP matrices
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

out vec3 v_world_normal;
out vec3 v_world_pos;

void main() {
    vec4 worldPos = u_model * vec4(a_pos, 1.0);
    mat3 normalMatrix = mat3(transpose(inverse(u_model)));
    v_world_normal = normalize(normalMatrix * a_normal);
    v_world_pos = worldPos.xyz;
    v_texcoord = a_texcoord;
    gl_Position = u_projection * u_view * worldPos;
}