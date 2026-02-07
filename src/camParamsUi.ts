import Camera from "./graphics/camera.js";
import { lookAt, perspective, multiply } from "../math/mat4.js";
import { setVec3 } from "../math/vec3.js";

type Mat4 = Float32Array & { length: 16 };

interface CamParamsUI {
    update: () => void;
}

export function createCamParamsUI(
    cam: Camera,
    view: Mat4,
    projection: Mat4,
    mvp: Mat4
): CamParamsUI {
    // Create container
    const container = document.createElement("div");
    container.id = "cam-controls";
    container.innerHTML = `
        <h3>Camera Parameters</h3>
        
        <div class="section-title">Position</div>
        <div class="control-row">
            <label>X:</label>
            <input type="range" id="cam-pos-x" min="-10" max="10" step="0.1" value="${cam.position[0]}">
            <span class="value" id="cam-pos-x-val">${cam.position[0].toFixed(1)}</span>
        </div>
        <div class="control-row">
            <label>Y:</label>
            <input type="range" id="cam-pos-y" min="-10" max="10" step="0.1" value="${cam.position[1]}">
            <span class="value" id="cam-pos-y-val">${cam.position[1].toFixed(1)}</span>
        </div>
        <div class="control-row">
            <label>Z:</label>
            <input type="range" id="cam-pos-z" min="0.1" max="20" step="0.1" value="${cam.position[2]}">
            <span class="value" id="cam-pos-z-val">${cam.position[2].toFixed(1)}</span>
        </div>
        
        <div class="section-title">Projection</div>
        <div class="control-row">
            <label>FOV (deg):</label>
            <input type="range" id="cam-fov" min="10" max="120" step="1" value="${(cam.fovy * 180 / Math.PI).toFixed(0)}">
            <span class="value" id="cam-fov-val">${(cam.fovy * 180 / Math.PI).toFixed(0)}</span>
        </div>
        <div class="control-row">
            <label>Near:</label>
            <input type="range" id="cam-near" min="0.01" max="5" step="0.01" value="${cam.near}">
            <span class="value" id="cam-near-val">${cam.near.toFixed(2)}</span>
        </div>
        <div class="control-row">
            <label>Far:</label>
            <input type="range" id="cam-far" min="10" max="500" step="1" value="${cam.far}">
            <span class="value" id="cam-far-val">${cam.far.toFixed(0)}</span>
        </div>
    `;
    document.body.appendChild(container);

    // Get UI elements
    const posX = document.getElementById("cam-pos-x") as HTMLInputElement;
    const posY = document.getElementById("cam-pos-y") as HTMLInputElement;
    const posZ = document.getElementById("cam-pos-z") as HTMLInputElement;
    const posXVal = document.getElementById("cam-pos-x-val")!;
    const posYVal = document.getElementById("cam-pos-y-val")!;
    const posZVal = document.getElementById("cam-pos-z-val")!;

    const fov = document.getElementById("cam-fov") as HTMLInputElement;
    const near = document.getElementById("cam-near") as HTMLInputElement;
    const far = document.getElementById("cam-far") as HTMLInputElement;
    const fovVal = document.getElementById("cam-fov-val")!;
    const nearVal = document.getElementById("cam-near-val")!;
    const farVal = document.getElementById("cam-far-val")!;

    function updateMatrices() {
        // Update camera position
        setVec3(cam.position, parseFloat(posX.value), parseFloat(posY.value), parseFloat(posZ.value));
        posXVal.textContent = parseFloat(posX.value).toFixed(1);
        posYVal.textContent = parseFloat(posY.value).toFixed(1);
        posZVal.textContent = parseFloat(posZ.value).toFixed(1);

        // Update projection params
        cam.fovy = parseFloat(fov.value) * Math.PI / 180;
        cam.near = parseFloat(near.value);
        cam.far = parseFloat(far.value);
        fovVal.textContent = fov.value;
        nearVal.textContent = parseFloat(near.value).toFixed(2);
        farVal.textContent = far.value;

        // Recalculate matrices
        lookAt(view, cam.right, cam.up, cam.forward, cam.position);
        perspective(projection, cam.fovy, cam.aspect, cam.near, cam.far);
        multiply(mvp, projection, view);
    }

    // Add event listeners
    [posX, posY, posZ, fov, near, far].forEach(input => {
        input.addEventListener("input", updateMatrices);
    });

    // Initial update
    updateMatrices();

    return {
        update: updateMatrices
    };
}

