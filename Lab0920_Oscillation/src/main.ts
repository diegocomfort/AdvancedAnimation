import { Utils } from "./utils.js";
import Mover from "./mover.js";
import BinaryCelestialSystem from "./system.js";
import Vec2D from "./vec2d.js";

window.addEventListener("load", init);

function init() {
    const game = {
        canvas: window.document.querySelector("canvas")!,
        time: 0,
        system: new BinaryCelestialSystem(new Mover({ radius: 0 }), {}),
    };

    Utils.resizeCanvas(game.canvas);

    const parent = new Mover({
        radius: 100,
        mass: 1e+16,
        position: new Vec2D(game.canvas.width / 2, game.canvas.height / 2),
    });

    game.system = new BinaryCelestialSystem(parent, {
        distance: 200,
        mass: 1e+3,
        amount: 10,
    });

    game.time = Date.now();
    animate(game);
}

function animate(game: {
    canvas: HTMLCanvasElement;
    time: number;
    system: BinaryCelestialSystem;
}) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    game.system.update(dt);
    game.system.render(game.canvas);

    requestAnimationFrame(() => animate(game));
}
