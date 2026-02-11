// decouple event generation from event handling using a command pattern
// for  easier testing and potential for features like event recording or replaying.
// simulation is not event driven but rather state driven


import {allocVec2, setVec2, Vec2} from "@/math/vec2";
import {KeyCode} from "@/src/inputSystem/keycodes";

type inputEventType = "Keydown" | "Keyup" | "Mousedown" | "Mouseup" | "Mousemove";


type InputEventType =
    | {
    type: "Keydown" | "Keyup";
    key: string;
    timestamp: number;
}
    | {
    type: "Mousedown" | "Mouseup";
    button: number;
    timestamp: number;
}
    | {
    type: "Mousemove";
    dx: number;
    dy: number;
    timestamp: number;
};

interface Command {
    execute(): void;
}

class EventQueue {
    private queue: InputEventType[] = [];

    enqueue(event: InputEventType): void {
        this.queue.push(event);
    }

    consume() {
        const events = [...this.queue];
        this.queue = [];
        return events;
    }

}

class InputCollector {
    constructor(private queue: EventQueue) {
        window.addEventListener("keydown", e => {
            this.queue.enqueue({
                type: "Keydown",
                key: e.code,
                timestamp: performance.now()
            });
        });

        window.addEventListener("keyup", e => {
            this.queue.enqueue({
                type: "Keyup",
                key: e.code,
                timestamp: performance.now()
            });
        });

        window.addEventListener("mousemove", e => {
            this.queue.enqueue({
                type: "Mousemove",
                dx: e.movementX,
                dy: e.movementY,
                timestamp: performance.now()
            });
        });
    }
}



export class InputManager {

    static readonly KeyCodes = KeyCode;
    private keyState = new Map<string,boolean>();


    private mousePosDx = 0;
    private mousePosDy = 0;

    private mousePos : Vec2 = allocVec2(0,0);

    private readonly inputEventQueue : EventQueue;
    private inputCollector : InputCollector;
    constructor( ) {
        this.inputEventQueue = new EventQueue();
        this.inputCollector = new InputCollector(this.inputEventQueue);
    }
    // consumes all the events captured in this particular frame and executes the corresponding commands

    update()
    {
        const events = this.inputEventQueue.consume();
        for (const event of events) {
            if(event.type === "Keydown") {
                this.keyState.set(event.key,true);
            }
            else if(event.type === "Keyup") {
                this.keyState.set(event.key,false);
            }
            else if(event.type === "Mousemove") {
                this.mousePosDx += event.dx;
                this.mousePosDy += event.dy;
            }
        }

        setVec2(this.mousePos,this.mousePosDx,this.mousePosDy);
    }

     isKeyPressed(key: KeyCode): boolean {
        return this.keyState.get(key) ?? false;
    }

}


