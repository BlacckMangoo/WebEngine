export const SHADERS = {
  fragment: "precision mediump float;\r\nvarying vec3 v_normal;\r\nuniform vec3 u_light_dir;\r\n\r\nvoid main() {\r\n    vec3 n = normalize(v_normal);\r\n    vec3 l = normalize(u_light_dir);\r\n    float diff = max(dot(n, l), 0.0);\r\n\r\n    // Add ambient so it's not completely dark\r\n    float ambient = 0.1;\r\n    vec3 baseColor = vec3(1.0, 0.4, 0.3);\r\n\r\n    gl_FragColor = vec4(baseColor * (ambient + diff), 1.0);\r\n}",
  vertex: "attribute vec3 a_pos;\r\nattribute vec3 a_normal;\r\nuniform vec3 u_size;\r\nuniform mat4 u_mvp;\r\nvarying vec3 v_normal;\r\n\r\nvoid main() {\r\n    v_normal = a_normal;\r\n    gl_Position = u_mvp * vec4(a_pos * u_size, 1.0);\r\n}",
} as const;

export type ShaderName = keyof typeof SHADERS;
