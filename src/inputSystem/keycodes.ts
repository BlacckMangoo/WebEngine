export const KeyCode = {
    // Letters
    A: "KeyA",
    B: "KeyB",
    C: "KeyC",
    D: "KeyD",
    E: "KeyE",
    F: "KeyF",
    G: "KeyG",
    H: "KeyH",
    I: "KeyI",
    J: "KeyJ",
    K: "KeyK",
    L: "KeyL",
    M: "KeyM",
    N: "KeyN",
    O: "KeyO",
    P: "KeyP",
    Q: "KeyQ",
    R: "KeyR",
    S: "KeyS",
    T: "KeyT",
    U: "KeyU",
    V: "KeyV",
    W: "KeyW",
    X: "KeyX",
    Y: "KeyY",
    Z: "KeyZ",

    // Numbers
    Digit0: "Digit0",
    Digit1: "Digit1",
    Digit2: "Digit2",
    Digit3: "Digit3",
    Digit4: "Digit4",
    Digit5: "Digit5",
    Digit6: "Digit6",
    Digit7: "Digit7",
    Digit8: "Digit8",
    Digit9: "Digit9",

    // Arrows
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",

    // Common
    Space: "Space",
    Enter: "Enter",
    Escape: "Escape",
    Tab: "Tab",
    Backspace: "Backspace",

    // Modifiers
    ShiftLeft: "ShiftLeft",
    ShiftRight: "ShiftRight",
    ControlLeft: "ControlLeft",
    ControlRight: "ControlRight",
    AltLeft: "AltLeft",
    AltRight: "AltRight",

    // Function keys
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
} as const;

export type KeyCode = typeof KeyCode[keyof typeof KeyCode];
