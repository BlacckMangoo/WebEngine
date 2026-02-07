export const SHADERS = {
  fragment: "precision mediump float;\r\nvoid main() {\r\n    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\r\n}",
  vertex: "attribute vec2 a_pos;\r\nuniform vec2 u_size;\r\n\r\nvoid main() {\r\n    gl_Position = vec4(a_pos * u_size, 0.0, 1.0);\r\n}",
} as const;

export type ShaderName = keyof typeof SHADERS;
