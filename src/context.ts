
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


function getGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("WebGL2 not supported");
    }
    return gl;
}

const gl = getGL(canvas);

export {gl, canvas};