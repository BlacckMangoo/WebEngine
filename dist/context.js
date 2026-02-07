const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
function getGL(canvas) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("WebGL2 not supported");
    }
    return gl;
}
const gl = getGL(canvas);
export { gl, canvas };
