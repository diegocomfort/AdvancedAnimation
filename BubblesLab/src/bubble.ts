import Vec2D from "./vec2d";

export default class Bubble {
    private pos: Vec2D;
    private vel: Vec2D;
    private acc: Vec2D;
    private isOverlapping: boolean = false;
    private color: (isOverlapping: boolean) => string;

    constructor(pos: Vec2D = new Vec2D(), 
                vel: Vec2D = new Vec2D(), 
                acc: Vec2D = new Vec2D()) {
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
    }


}