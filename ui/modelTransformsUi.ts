import { Vec3, setVec3, allocVec3 } from "@/math/vec3";
import {MeshTransform} from "@/src";


export interface ModelTransformsUI {
    updateMesh: () => void;
    transform: MeshTransform;
}

export function createModelTransformsUI(transform: MeshTransform ): ModelTransformsUI {
    // Transform state

    const container = document.createElement("div");
    container.id = "model-controls";
    container.innerHTML = `
        <h3>Model Transform</h3>
        
        <div class="section-title">Translation</div>
        <div class="control-row">
            <label>X:</label>
            <input type="range" id="model-trans-x" min="-5" max="5" step="0.1" value="0">
            <span class="value" id="model-trans-x-val">0.0</span>
        </div>
        <div class="control-row">
            <label>Y:</label>
            <input type="range" id="model-trans-y" min="-5" max="5" step="0.1" value="0">
            <span class="value" id="model-trans-y-val">0.0</span>
        </div>
        <div class="control-row">
            <label>Z:</label>
            <input type="range" id="model-trans-z" min="-5" max="5" step="0.1" value="0">
            <span class="value" id="model-trans-z-val">0.0</span>
        </div>
        
        <div class="section-title">Scale</div>
        <div class="control-row">
            <label>X:</label>
            <input type="range" id="model-scale-x" min="0.1" max="5" step="0.1" value="1">
            <span class="value" id="model-scale-x-val">1.0</span>
        </div>
        <div class="control-row">
            <label>Y:</label>
            <input type="range" id="model-scale-y" min="0.1" max="5" step="0.1" value="1">
            <span class="value" id="model-scale-y-val">1.0</span>
        </div>
        <div class="control-row">
            <label>Z:</label>
            <input type="range" id="model-scale-z" min="0.1" max="5" step="0.1" value="1">
            <span class="value" id="model-scale-z-val">1.0</span>
        </div>
        
        <div class="section-title">Rotation</div>
        <div class="control-row">
            <label>Angle (deg):</label>
            <input type="range" id="model-rot-angle" min="0" max="360" step="1" value="0">
            <span class="value" id="model-rot-angle-val">0</span>
        </div>
        <div class="control-row">
            <label>Axis X:</label>
            <input type="range" id="model-rot-axis-x" min="-1" max="1" step="0.1" value="0">
            <span class="value" id="model-rot-axis-x-val">0.0</span>
        </div>
        <div class="control-row">
            <label>Axis Y:</label>
            <input type="range" id="model-rot-axis-y" min="-1" max="1" step="0.1" value="1">
            <span class="value" id="model-rot-axis-y-val">1.0</span>
        </div>
        <div class="control-row">
            <label>Axis Z:</label>
            <input type="range" id="model-rot-axis-z" min="-1" max="1" step="0.1" value="0">
            <span class="value" id="model-rot-axis-z-val">0.0</span>
        </div>
    `;
    document.body.appendChild(container);

    // Get UI elements - Translation
    const transX = document.getElementById("model-trans-x") as HTMLInputElement;
    const transY = document.getElementById("model-trans-y") as HTMLInputElement;
    const transZ = document.getElementById("model-trans-z") as HTMLInputElement;
    const transXVal = document.getElementById("model-trans-x-val")!;
    const transYVal = document.getElementById("model-trans-y-val")!;
    const transZVal = document.getElementById("model-trans-z-val")!;

    // Scale
    const scaleX = document.getElementById("model-scale-x") as HTMLInputElement;
    const scaleY = document.getElementById("model-scale-y") as HTMLInputElement;
    const scaleZ = document.getElementById("model-scale-z") as HTMLInputElement;
    const scaleXVal = document.getElementById("model-scale-x-val")!;
    const scaleYVal = document.getElementById("model-scale-y-val")!;
    const scaleZVal = document.getElementById("model-scale-z-val")!;

    // Rotation
    const rotAngle = document.getElementById("model-rot-angle") as HTMLInputElement;
    const rotAxisX = document.getElementById("model-rot-axis-x") as HTMLInputElement;
    const rotAxisY = document.getElementById("model-rot-axis-y") as HTMLInputElement;
    const rotAxisZ = document.getElementById("model-rot-axis-z") as HTMLInputElement;
    const rotAngleVal = document.getElementById("model-rot-angle-val")!;
    const rotAxisXVal = document.getElementById("model-rot-axis-x-val")!;
    const rotAxisYVal = document.getElementById("model-rot-axis-y-val")!;
    const rotAxisZVal = document.getElementById("model-rot-axis-z-val")!;

    function updateMesh() {
        // Update transform values from UI
        setVec3(transform.translation,
            parseFloat(transX.value),
            parseFloat(transY.value),
            parseFloat(transZ.value)
        );
        transXVal.textContent = parseFloat(transX.value).toFixed(1);
        transYVal.textContent = parseFloat(transY.value).toFixed(1);
        transZVal.textContent = parseFloat(transZ.value).toFixed(1);

        setVec3(transform.scaling,
            parseFloat(scaleX.value),
            parseFloat(scaleY.value),
            parseFloat(scaleZ.value)
        );
        scaleXVal.textContent = parseFloat(scaleX.value).toFixed(1);
        scaleYVal.textContent = parseFloat(scaleY.value).toFixed(1);
        scaleZVal.textContent = parseFloat(scaleZ.value).toFixed(1);

        transform.rotAngle = parseFloat(rotAngle.value) * Math.PI / 180;
        setVec3(transform.rotAxis,
            parseFloat(rotAxisX.value),
            parseFloat(rotAxisY.value),
            parseFloat(rotAxisZ.value)
        );
        rotAngleVal.textContent = rotAngle.value;
        rotAxisXVal.textContent = parseFloat(rotAxisX.value).toFixed(1);
        rotAxisYVal.textContent = parseFloat(rotAxisY.value).toFixed(1);
        rotAxisZVal.textContent = parseFloat(rotAxisZ.value).toFixed(1);
    }

    // Add event listeners
    const inputs = [transX, transY, transZ, scaleX, scaleY, scaleZ, rotAngle, rotAxisX, rotAxisY, rotAxisZ];
    inputs.forEach(input => {
        input.addEventListener("input", updateMesh);
    });

    // Initial update
    updateMesh();

    return {
        updateMesh,
        transform
    };
}

