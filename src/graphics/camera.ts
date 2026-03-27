import Transform from "./transform";
import { canvas } from "./context";
import { allocMat4, lookAt, Mat4, perspective } from "@/math/mat4";
import { allocVec3, Vec3 } from "@/math/vec3";
import { allocQuaternion, rotateQuaternionAroundAxis, rotateVec3ByQuaternion, setQuaternion, slerp } from "@/math/quaternion";
import { InputManager } from "../inputSystem/inputManager";
import { KeyCode } from "../inputSystem/keycodes";
import Skybox from "./skybox";
import { CubeMapName } from "./cubemapData";

const WORLD_UP = allocVec3(0, 1, 0);
const LOCAL_FORWARD = allocVec3(0, 0, -1);
const LOCAL_RIGHT = allocVec3(1, 0, 0);

class Camera {
    transform : Transform = new Transform(0, 0, 0);
    skybox? : Skybox;
    fov : number = 45;
    aspect : number = canvas .width / canvas.height;
    near : number = 0.1;
    far : number = 100;
    moveSpeed : number;
    rotateSpeed : number;
    maxPitch : number;
    currentPitch : number;

    private readonly up  = allocVec3(0, 0, 0);
    private readonly forward = allocVec3(0, 0, -1);
    private readonly right = allocVec3(1, 0, 0);
    private readonly rotationTarget = allocQuaternion();

     center = allocVec3(0, 0, 0)

    constructor(skyboxName?: CubeMapName)
    {
        if (skyboxName) {
            this.skybox = new Skybox(skyboxName);
        }
        // Default camera looks towards -Z, so we set the orientation to identity quaternion

        this.moveSpeed = 6;
        this.rotateSpeed = 0.008;
        this.maxPitch = Math.PI / 2 - 0.001;
        this.currentPitch = 0;
        setQuaternion(this.rotationTarget, this.transform.orientattion)
    }

    getPosition(): Vec3 {
        return this.transform.position
    }

    view = allocMat4()
    projection = allocMat4()

    getProjectionMatrix(): Mat4 {
        perspective(this.projection, this.fov * Math.PI / 180, this.aspect, this.near, this.far)
        return this.projection
    }
        getViewMatrix(): Mat4 {
        rotateVec3ByQuaternion(this.up, WORLD_UP, this.transform.orientattion)
        rotateVec3ByQuaternion(this.forward, LOCAL_FORWARD, this.transform.orientattion)
        const eye = this.transform.position
        this.center[0] = eye[0] + this.forward[0]
        this.center[1] = eye[1] + this.forward[1]
        this.center[2] = eye[2] + this.forward[2]
        lookAt(this.view, eye, this.center, this.up)
        return this.view
    }


    handleInput(inputmanager: InputManager, deltaTime: number): void
    {
        const mouseDelta = inputmanager.getMousePosition()
        const isDragging = inputmanager.isMouseButtonPressed(0)

        if (isDragging && (mouseDelta[0] !== 0 || mouseDelta[1] !== 0)) {
            const yawDelta = -mouseDelta[0] * this.rotateSpeed
            const pitchDelta = -mouseDelta[1] * this.rotateSpeed

            setQuaternion(this.rotationTarget, this.transform.orientattion)

            if (yawDelta !== 0) {
                rotateQuaternionAroundAxis(this.rotationTarget, this.rotationTarget, WORLD_UP, yawDelta)
            }

            rotateVec3ByQuaternion(this.right, LOCAL_RIGHT, this.rotationTarget)
            const nextPitch = Math.max(-this.maxPitch, Math.min(this.maxPitch, this.currentPitch + pitchDelta))
            const appliedPitchDelta = nextPitch - this.currentPitch

            if (appliedPitchDelta !== 0) {
                rotateQuaternionAroundAxis(this.rotationTarget, this.rotationTarget, this.right, appliedPitchDelta)
                this.currentPitch = nextPitch
            }
        }

        if (isDragging) {
            setQuaternion(this.transform.orientattion, this.rotationTarget)
        } else {
            // Ease toward target when not dragging to avoid tiny residual jitter.
            const rotationBlend = Math.min(1, 10 * deltaTime)
            slerp(this.transform.orientattion, this.transform.orientattion, this.rotationTarget, rotationBlend)
        }

        rotateVec3ByQuaternion(this.forward, LOCAL_FORWARD, this.transform.orientattion)
        rotateVec3ByQuaternion(this.right, LOCAL_RIGHT, this.transform.orientattion)

        if(inputmanager.isKeyPressed(KeyCode.W))
        {
            this.transform.position[0] += this.forward[0] * this.moveSpeed * deltaTime;
            this.transform.position[1] += this.forward[1] * this.moveSpeed * deltaTime;
            this.transform.position[2] += this.forward[2] * this.moveSpeed * deltaTime;
        }
        if(inputmanager.isKeyPressed(KeyCode.S))
        {
            this.transform.position[0] -= this.forward[0] * this.moveSpeed * deltaTime;
            this.transform.position[1] -= this.forward[1] * this.moveSpeed * deltaTime;
            this.transform.position[2] -= this.forward[2] * this.moveSpeed * deltaTime;
        }
            if(inputmanager.isKeyPressed(KeyCode.A))
        {
            this.transform.position[0] -= this.right[0] * this.moveSpeed * deltaTime;
            this.transform.position[1] -= this.right[1] * this.moveSpeed * deltaTime;
            this.transform.position[2] -= this.right[2] * this.moveSpeed * deltaTime;
        }
        if(inputmanager.isKeyPressed(KeyCode.D))
        {
            this.transform.position[0] += this.right[0] * this.moveSpeed * deltaTime;
            this.transform.position[1] += this.right[1] * this.moveSpeed * deltaTime;
            this.transform.position[2] += this.right[2] * this.moveSpeed * deltaTime;
        }
        if( inputmanager.isKeyPressed(KeyCode.Q))
        {
            this.transform.position[1] -= this.moveSpeed * deltaTime;
        }
        if( inputmanager.isKeyPressed(KeyCode.E))
        {
            this.transform.position[1] += this.moveSpeed * deltaTime;
        }

    }



}

export default Camera;