export interface Color {
    r : number;
    g : number;
    b : number;
}

const BLACK : Color = {
    r : 0 ,
    g : 0 ,
    b : 0 ,
}

const RED : Color = {
    r : 1 ,
    g : 0,
    b : 0 ,
}

const GREEN : Color = {
    r : 0 ,
    g : 1,
    b : 0 ,
}

const BLUE : Color = {
    r : 0 ,
    g : 0,
    b : 1 ,
}

const YELLOW : Color = {
    r : 1 ,
    g : 1,
    b : 0 ,
}

const CYAN : Color = {
    r : 0 ,
    g : 1,
    b : 1 ,
}

const MAGENTA : Color = {
    r : 1 ,
    g : 0,
    b : 1 ,
}

const WHITE : Color = {
    r : 1 ,
    g : 1,
    b : 1 ,
}

export const COLORS = {
    BLACK, RED, GREEN, BLUE, YELLOW, CYAN, MAGENTA, WHITE
}
