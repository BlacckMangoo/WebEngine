export const SHADERS = {
  fragment: "#version 300 es\r\n\r\nprecision mediump float;\r\nin vec3 v_normal;\r\nuniform vec3 u_light_dir;\r\nuniform vec3 u_base_color ;\r\n\r\nout vec4 fragColor;\r\n\r\nvoid main() {\r\n    vec3 n = normalize(v_normal);\r\n    vec3 l = normalize(u_light_dir);\r\n    float diff = max(dot(n, l), 0.0);\r\n\r\n    // Add ambient so it's not completely dark\r\n    float ambient = 0.1;\r\n    fragColor = vec4(u_base_color * (ambient + diff), 1.0);\r\n}",
  vertex: "#version 300 es\r\n\r\nlayout(location = 0) in vec3 a_pos;\r\nlayout(location = 1) in vec3 a_normal;\r\nuniform mat4 u_mvp;\r\nout vec3 v_normal;\r\n\r\nvoid main() {\r\n    v_normal = a_normal;\r\n    gl_Position = u_mvp * vec4(a_pos, 1.0);\r\n}",
} as const;

export type ShaderName = keyof typeof SHADERS;
