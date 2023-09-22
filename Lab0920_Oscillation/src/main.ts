import { Utils } from "./utils.js";
import Mover from "./mover.js";
import CelestialSystem from "./system.js";
import Vec2D from "./vec2d.js";

window.addEventListener("load", init);

function init() {
    const game = {
        canvas: window.document.querySelector("canvas")!,
        time: 0,
        system: new CelestialSystem(new Mover({ radius: 0 }), {}),
    };

    Utils.resizeCanvas(game.canvas);

    const parent = new Mover({
        radius: 100,
        mass: 1e+16,
        position: new Vec2D(game.canvas.width / 2, game.canvas.height / 2),
        velocity: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 100),
        acceleration: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 150),
    });

    game.system = new CelestialSystem(parent, {
        orbitalRadius: 200,
        mass: 1e+3,
        amount: 50,
        radius: 5,
    });

    game.time = Date.now();
    animate(game);
}

function animate(game: {
    canvas: HTMLCanvasElement;
    time: number;
    system: CelestialSystem;
}) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    const n = 10;
    for (let i = 0; i < n; ++i)
        game.system.update(dt / n);
    game.system.render(game.canvas, {
        // satellites: (a, i) => `hsl(${a * 180 / Math.PI}, 100%,  50%)`
        satellites: (a, i) => `hsl(${i * 360 / game.system.numSatellites}, 100%,  50%)`
    });

    requestAnimationFrame(() => animate(game));
}
