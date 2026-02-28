#version 300 es

precision mediump float;
in vec3 v_normal;
uniform vec3 u_light_dir;
uniform vec3 u_base_color;
out vec4 fragColor;

void main() {
    //basic lambertian diffuse + ambient
    vec3 n = normalize(v_normal);

    vec3 l = normalize(u_light_dir);
    float diff = max(dot(n, l), 0.0);
    float ambient = 0.4;
    vec3 color = u_base_color * (ambient + diff);

    fragColor = vec4(color, 1.0);

    }