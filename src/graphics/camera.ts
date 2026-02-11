import {allocVec3, Vec3, normalize, cross, scaleAndAdd, translateY} from "@/math/vec3";
import {lookAt, perspective, Mat4} from "@/math/mat4";
import {InputManager} from "@/src/inputSystem/inputManager";
import {KeyCode} from "@/src/inputSystem/keycodes";

class Camera {
    // Projection parameters
    aspect: number = 1;
    near: number = 0.1;
    far: number = 100;
    fovy: number = Math.PI / 4;

    // Basis Vectors For Camera Coordinates
    // Modulus of these vectors should be 1, and they should be orthogonal to each other.
    position: Vec3 = allocVec3(0, 0, 2);
    right: Vec3 = allocVec3(1, 0, 0);
    up: Vec3 = allocVec3(0, 1, 0);
    forward: Vec3 = allocVec3(0, 0, -1);

    // Camera controller state
    private yaw: number = -Math.PI / 2; // Start looking forward (-Z)
    private pitch: number = 0;
    private sensitivity: number = 0.002; // Mouse sensitivity
    private moveSpeed: number = 2.0;
    private readonly pitchLimit = Math.PI / 2 - 0.01; // Prevent gimbal lock

    constructor(aspect: number, near: number, far: number, fovy: number) {
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.fovy = fovy;
    }

    public getViewMatrix(view: Mat4): Mat4 {
        return lookAt(view, this.up, this.forward, this.position);
    }

    public getProjectionMatrix(projection: Mat4): Mat4 {
        return perspective(projection, this.fovy, this.aspect, this.near, this.far);
    }

    public processInput(input: InputManager, deltaTime: number): void {
        this.updateOrientation(input);
        this.updateMovement(input, deltaTime);
    }

    private updateOrientation(input: InputManager): void {
        const mousePos = input.getMousePosition();
        const dx = mousePos[0];
        const dy = mousePos[1];

        // Update yaw (horizontal rotation)
        this.yaw -= dx * this.sensitivity;

        // Update pitch (vertical rotation) with clamping
        this.pitch -= dy * this.sensitivity;
        this.pitch = Math.max(-this.pitchLimit, Math.min(this.pitchLimit, this.pitch));

        // Calculate new camera vectors from yaw and pitch
        this.updateCameraVectors();
    }

    private updateCameraVectors(): void {
        // Calculate forward vector from spherical coordinates
        this.forward[0] = Math.cos(this.pitch) * Math.cos(this.yaw);
        this.forward[1] = Math.sin(this.pitch);
        this.forward[2] = Math.cos(this.pitch) * Math.sin(this.yaw);
        normalize(this.forward, this.forward);

        // Calculate right vector (cross product of world up and forward)
        const worldUp = allocVec3(0, 1, 0);
        cross(this.right, worldUp, this.forward);
        normalize(this.right, this.right);

        // Calculate up vector (cross product of forward and right)
        cross(this.up, this.forward, this.right);
        normalize(this.up, this.up);
    }


    private updateMovement(input: InputManager, deltaTime: number): void {
        const speed = this.moveSpeed * deltaTime;


        // WASD movement
        if (input.isKeyPressed(KeyCode.W)) {
            scaleAndAdd(this.position, this.position, this.forward, speed);
        }
        if (input.isKeyPressed(KeyCode.S)) {
            scaleAndAdd(this.position, this.position, this.forward, -speed);
        }
        if (input.isKeyPressed(KeyCode.A)) {
            scaleAndAdd(this.position, this.position, this.right, -speed);
        }
        if (input.isKeyPressed(KeyCode.D)) {
            scaleAndAdd(this.position, this.position, this.right, speed);
        }

        // Up/Down movement
        if (input.isKeyPressed(KeyCode.ArrowUp)) {
            translateY(this.position, speed);
        }
        if (input.isKeyPressed(KeyCode.ArrowDown)) {
            translateY(this.position, -speed);
        }
    }

}

export default Camera;

