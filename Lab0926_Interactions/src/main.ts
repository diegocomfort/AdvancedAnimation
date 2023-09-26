import { Utils } from "./utils.js";
import Mover from "./mover.js";
import Vec2D from "./vec2d.js";

window.addEventListener("load", init);

function init() {
    const game = {
        canvas: window.document.querySelector("canvas")!,
        time: 0,
        system: new Array<Mover>(),
    };

    Utils.resizeCanvas(game.canvas);

    const n = 10;
    for (let i = 0; i < n; ++i) {
        game.system.push(
            new Mover({
                radius: 40,
                position: new Vec2D(
                    Math.random() * game.canvas.width,
                    Math.random() * game.canvas.height
                ),
                velocity: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 20),
                orbiters: {
                    amount: i,
                    orbitalRadius: 100,
                    radius: 15,
                    angularVelocity: Math.PI * 2 / 50
                }
            })
        );
    }

    game.time = Date.now();
    console.log(game);
    animate(game);
}

function animate(game: {
    canvas: HTMLCanvasElement;
    time: number;
    system: Mover[];
}) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) * 1e-3; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    const n = 10;
    for (let i = 0; i < n; ++i) {
        for (const mover of game.system) {
            mover.update(dt);
        }
    }

    for (const mover of game.system) {
        mover.checkWalls(game.canvas.width, game.canvas.height);
        mover.checkMovers(game.system);
        mover.render(game.canvas);
    }

    requestAnimationFrame(() => animate(game));
}
