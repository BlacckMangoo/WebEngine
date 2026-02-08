precision mediump float;
varying vec3 v_normal;
uniform vec3 u_light_dir;

void main() {
    vec3 n = normalize(v_normal);
    vec3 l = normalize(u_light_dir);
    float diff = max(dot(n, l), 0.0);

    // Add ambient so it's not completely dark
    float ambient = 0.1;
    vec3 baseColor = vec3(1.0, 0.4, 0.3);

    gl_FragColor = vec4(baseColor * (ambient + diff), 1.0);
}