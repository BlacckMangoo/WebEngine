import Camera from "@/src/graphics/camera";
import {InputManager} from "@/src/inputSystem/inputManager";
import {normalize, cross, allocVec3} from "@/math/vec3";

export class CameraController {
    private yaw: number = -Math.PI / 2; // Start looking forward (-Z)
    private pitch: number = 0;
    private readonly sensitivity: number = 0.001; // Mouse sensitivity

    private readonly pitchLimit = Math.PI / 2 - 0.01; // Prevent gimbal lock

    constructor(private camera: Camera, sensitivity: number = 0.002) {
        this.sensitivity = sensitivity;
    }


    public updateOrientation(input: InputManager): void {
        const mousePos = input.getMousePosition();
        const dx = mousePos[0];
        const dy = mousePos[1];

        // Update yaw (horizontal rotation)
        this.yaw -= dx * this.sensitivity;

        // Update pitch (vertical rotation) with clamping
        this.pitch -= dy * this.sensitivity;
        this.pitch = Math.max(-this.pitchLimit, Math.min(this.pitchLimit, this.pitch));

        // Calculate new forward direction from yaw and pitch
        this.updateCameraVectors();
    }

    private updateCameraVectors(): void {
        // Calculate forward vector from spherical coordinates
        const forward = this.camera.forward;
        forward[0] = Math.cos(this.pitch) * Math.cos(this.yaw);
        forward[1] = Math.sin(this.pitch);
        forward[2] = Math.cos(this.pitch) * Math.sin(this.yaw);
        normalize(forward, forward);

        // Calculate right vector (cross product of world up and forward)
        const worldUp = allocVec3(0, 1, 0);
        cross(this.camera.right, worldUp, forward);
        normalize(this.camera.right, this.camera.right);

        // Calculate up vector (cross product of forward and right)
        cross(this.camera.up, forward, this.camera.right);
        normalize(this.camera.up, this.camera.up);
    }

}



