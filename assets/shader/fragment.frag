#version 300 es

precision mediump float;
in vec3 v_normal;
uniform vec3 u_light_dir;
uniform vec3 u_base_color ;

out vec4 fragColor;

void main() {
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light_dir);
    float diff = max(dot(n, l), 0.0);

    // Add ambient so it's not completely dark
    float ambient = 0.1;
    fragColor = vec4(u_base_color * (ambient + diff), 1.0);
}