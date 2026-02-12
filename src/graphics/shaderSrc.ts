export const SHADERS = {
  fragment: "#version 300 es\r\n\r\nprecision mediump float;\r\nin vec3 v_normal;\r\nin vec3 v_world_pos;\r\nuniform vec3 u_camera_pos;\r\nuniform vec3 u_light_dir;\r\nuniform vec3 u_base_color;\r\nuniform samplerCube u_env_map;\r\nout vec4 fragColor;\r\n\r\nvoid main() {\r\n    vec3 n = normalize(v_normal);\r\n\r\n    vec3 l = normalize(u_light_dir);\r\n    float diff = max(dot(n, l), 0.0);\r\n    float ambient = 0.4;\r\n\r\n    vec3 view_dir = normalize(v_world_pos - u_camera_pos);\r\n    vec3 reflect_dir = reflect(view_dir, n);\r\n    vec3 env_color = texture(u_env_map, reflect_dir).rgb;\r\n\r\n    vec3 lighting = u_base_color * (ambient + diff);\r\n    vec3 final_color = mix(lighting, env_color*diff, 0.3); // 30% reflection, 70% diffuse\r\n\r\n    fragColor = vec4(final_color, 1.0);\r\n}",
  skybox_fragment: "",
  skybox_vertex: "",
  vertex: "#version 300 es\r\n\r\nlayout(location = 0) in vec3 a_pos;\r\nlayout(location = 1) in vec3 a_normal;\r\nuniform mat4 u_model;\r\nuniform mat4 u_view;\r\nuniform mat4 u_projection;\r\nout vec3 v_normal;\r\nout vec3 v_world_pos;\r\n\r\nvoid main() {\r\n    v_world_pos = (u_model * vec4(a_pos, 1.0)).xyz;\r\n\r\n    v_normal = mat3(u_model) * a_normal;\r\n\r\n    gl_Position = u_projection * u_view * u_model * vec4(a_pos, 1.0);\r\n}",
} as const;

export type ShaderName = keyof typeof SHADERS;
