export const SHADERS = {
  fragment: "#version 300 es\n\nprecision mediump float;\nin vec3 v_normal;\nuniform vec3 u_light_dir;\nuniform vec3 u_base_color;\nout vec4 fragColor;\n\nvoid main() {\n    //basic lambertian diffuse + ambient\n    vec3 n = normalize(v_normal);\n\n    vec3 l = normalize(u_light_dir);\n    float diff = max(dot(n, l), 0.0);\n    float ambient = 0.4;\n    vec3 color = u_base_color * (ambient + diff);\n\n    fragColor = vec4(color, 1.0);\n\n    }",
  vertex: "#version 300 es\n\nlayout(location = 0) in vec3 a_pos;\nlayout(location = 1) in vec3 a_normal;\n\n//MVP matrices\nuniform mat4 u_model;\nuniform mat4 u_view;\nuniform mat4 u_projection;\n\nout vec3 v_normal;\n\nvoid main() {\n\n    v_normal = mat3(u_model) * a_normal;\n\n    gl_Position = u_projection * u_view * u_model * vec4(a_pos, 1.0);\n}",
} as const;

export type ShaderName = keyof typeof SHADERS;
