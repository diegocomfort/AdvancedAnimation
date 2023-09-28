import Vec2D from "./vec2d.js";

export default interface System {
    /**
     * Update this System
     * @param deltaTime the time, in seconds, between the start of the current frame and the start of the previous
     * @param environment the environment that this System belongs to
     */
    update(
        deltaTime: number,
        environment: ReadonlyArray<Readonly<System>>,
        envWidth: number,
        envHeight: number,
    ): void;

    /**
     * Change the environment if certain behaviors should occur
     * @param environment the environment that this System belongs to
     */
    applyBehaviors(environment: Array<System>): void;
    
    /**
     * Render this System
     * @param canvas the canvas to render this onto
     */
    render(canvas: HTMLCanvasElement): void;

    /**
     * Get the total mass of this System
     */
    get mass(): number;

    /**
     * Get the position (or average position) of this System
     */
    get position(): Vec2D;
}
