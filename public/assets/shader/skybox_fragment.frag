#version 300 es

precision mediump float;
uniform samplerCube u_skybox;

void main() {
    vec3 skybox = texture(u_skybox, vec3(gl_FragCoord.xy, 1.0)).rgb;
    gl_FragColor = vec4(skybox, 1.0);
}