import {allocVec2, Vec2} from "@/math/vec2";

class InputManager{

    private static instance: InputManager ;
    private readonly mousePos : Vec2  ;

    private constructor() {
        this.mousePos = allocVec2(0,0);
    }

    static  getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager();
        }
        return InputManager.instance;
    }

      UpdateMousePos(): void {

        window.addEventListener("mousemove", (event) => {
            this.mousePos[0] = event.clientX;
            this.mousePos[1] = event.clientY;
        });

    }
    update()
    {
        this.UpdateMousePos();
    }


}

export const  InputManger = InputManager.getInstance();
