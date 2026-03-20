#version 300 es

precision mediump float;
in vec3 v_world_normal;
in vec3 v_world_pos;
uniform vec3 u_light_dir;
uniform vec3 u_base_color;
uniform vec3 u_camera_pos;
uniform samplerCube u_skybox;
out vec4 fragColor;

void main() {
    vec3 n = normalize(v_world_normal);

    vec3 l = normalize(u_light_dir);
    float diff = max(dot(n, l), 0.0);
    float ambient = 0.2;
    vec3 diffuse = u_base_color * (ambient + diff);

    vec3 viewDir = normalize(v_world_pos - u_camera_pos);
    vec3 reflectedDir = reflect(viewDir, n);
    vec3 reflectedColor = texture(u_skybox, reflectedDir).rgb;

    float reflectionStrength = 0.35;
    vec3 color = mix(diffuse, reflectedColor, reflectionStrength);

    fragColor = vec4(color, 1.0);
}