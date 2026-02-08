import {gl, canvas} from "@/src/graphics/context";
import {program} from "@/src/graphics/shader";
import {allocMat4, multiply, lookAt, perspective, translate, scale, rotate, identity} from "@/math/mat4";
import Camera from "@/src/graphics/camera";
import {createCamParamsUI} from "@/ui/camParamsUi";
import {createModelTransformsUI} from "@/ui/modelTransformsUi";
import horse from "@/assets/models/horse.json";
import {allocVec3, setVec3, Vec3} from "@/math/vec3";
import {Mesh, ModelData} from "@/src/graphics/mesh";
const modelData: ModelData = horse as ModelData ;


const aspect = canvas.width / canvas.height;
const cam : Camera = new Camera(aspect, 0.1, 100, Math.PI / 4);

const mesh = new Mesh(modelData);

// bind index buffer
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibuf);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

// bind vertex buffer
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbuf);
gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

// bind normal buffer
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nbuf);
gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);

// Position attribute
const aPos = gl.getAttribLocation(program, "a_pos");
if (aPos === -1) throw new Error("a_pos not found");
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbuf);
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

// Normal attribute
const aNormal = gl.getAttribLocation(program, "a_normal");
if (aNormal === -1) throw new Error("a_normal not found");
gl.bindBuffer(gl.ARRAY_BUFFER, mesh.nbuf);
gl.enableVertexAttribArray(aNormal);
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);


const uSize = gl.getUniformLocation(program, "u_size");
if (!uSize) throw new Error("u_size not found");

const uMvp = gl.getUniformLocation(program, "u_mvp");
if (!uMvp) throw new Error("u_mvp not found");

const uLightDir = gl.getUniformLocation(program, "u_light_dir");
if (!uLightDir) throw new Error("u_light_dir not found");


let  time = 0 ;
const size = allocVec3();
const view = allocMat4();
const projection = allocMat4();
const model = allocMat4();
const mvp = allocMat4();
const viewProj = allocMat4();

// Temp matrices for TRS computation
const tempS = allocMat4();
const tempR = allocMat4();

const camUI = createCamParamsUI(cam);
const modelUI = createModelTransformsUI(mesh.meshTransform);

const fixedDt = 1 / 120;
let accumulator = 0;
let lastTime = performance.now();


gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

function Render(): void {
    // Update UI values
    camUI.updateCam();
    modelUI.updateMesh();

    // Compute View and Projection matrices from camera
    lookAt(view, cam.right, cam.up, cam.forward, cam.position);
    perspective(projection, cam.fovy, cam.aspect, cam.near, cam.far);
    multiply(viewProj, projection, view);

    // Compute Model matrix from TRS: M = T * R * S
    const t = modelUI.transform;
    identity(tempS);
    scale(tempS, tempS, t.scaling);
    rotate(tempR, tempS, t.rotAngle, t.rotAxis);
    translate(model, tempR, t.translation);

    // Compute MVP = Projection * View * Model
    multiply(mvp, viewProj, model);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(uMvp, false, mvp);
    gl.uniform3fv(uSize, size);
    gl.uniform3f(uLightDir, 0.5, 1.0, 0.3);

    gl.drawElements(
        gl.TRIANGLES,
        mesh.indices.length,
        gl.UNSIGNED_INT,
        0
    );
}

function FixedUpdate(dt: number): void {
    time += dt;
    setVec3(
        size,
        1,1,1
    );
}

function gameloop(now: number): void {
    let frameTime = (now - lastTime) / 1000;
    lastTime = now;
    if (frameTime > 0.25) frameTime = 0.25;
    accumulator += frameTime;

    while (accumulator >= fixedDt) {
        FixedUpdate(fixedDt);
        accumulator -= fixedDt;
    }
    Render();
    requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);