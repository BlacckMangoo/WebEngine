#version 300 es

precision mediump float;
in vec3 v_normal;
in vec3 v_world_pos;
uniform vec3 u_camera_pos;
uniform vec3 u_light_dir;
uniform vec3 u_base_color;
uniform samplerCube u_env_map;
out vec4 fragColor;

void main() {
    vec3 n = normalize(v_normal);

    vec3 l = normalize(u_light_dir);
    float diff = max(dot(n, l), 0.0);
    float ambient = 0.1;

    vec3 view_dir = normalize(v_world_pos - u_camera_pos);
    vec3 reflect_dir = reflect(view_dir, n);
    vec3 env_color = texture(u_env_map, reflect_dir).rgb;

    vec3 lighting = u_base_color * (ambient + diff);
    vec3 final_color = mix(lighting, env_color*diff, 0.3); // 30% reflection, 70% diffuse

    fragColor = vec4(final_color, 1.0);
}