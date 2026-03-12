export const SHADERS = {
  fragment: "#version 300 es\r\n\r\nprecision mediump float;\r\nin vec3 v_normal;\r\nuniform vec3 u_light_dir;\r\nuniform vec3 u_base_color;\r\nout vec4 fragColor;\r\n\r\nvoid main() {\r\n    //basic lambertian diffuse + ambient\r\n    vec3 n = normalize(v_normal);\r\n\r\n    vec3 l = normalize(u_light_dir);\r\n    float diff = max(dot(n, l), 0.0);\r\n    float ambient = 0.2;\r\n    vec3 color = u_base_color * (ambient + diff);\r\n\r\n    fragColor = vec4(color, 1.0);\r\n\r\n    }",
  vertex: "#version 300 es\r\n\r\nlayout(location = 0) in vec3 a_pos;\r\nlayout(location = 1) in vec3 a_normal;\r\n\r\n//MVP matrices\r\nuniform mat4 u_model;\r\nuniform mat4 u_view;\r\nuniform mat4 u_projection;\r\n\r\nout vec3 v_normal;\r\n\r\nvoid main() {\r\n\r\n    v_normal = mat3(u_model) * a_normal;\r\n\r\n    gl_Position = u_projection * u_view * u_model * vec4(a_pos, 1.0);\r\n}",
} as const;

export type ShaderName = keyof typeof SHADERS;
