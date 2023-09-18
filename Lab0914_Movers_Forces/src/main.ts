import { Utils } from "./utils.js"
import Mover from "./mover.js";
import Vec2D from "./vec2d.js";

window.addEventListener('load', init);

function init() {
    const game = {
        canvas: window.document.querySelector('canvas')!,
        time: 0,
        movers: new Array<Mover>,
        gravity: 0,
    };
    
    game.canvas.addEventListener("mousedown", () => game.gravity = Utils.mod(game.gravity + 1, 3));

    Utils.resizeCanvas(game.canvas);

    for (let i = 0; i < 100; ++i) {
        game.movers.push(new Mover({
            radius: Math.random() ** 10 * 75 + 5,
            position: new Vec2D(game.canvas.width * Math.random(), game.canvas.height * Math.random()),
            velocity: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 30 + 30)
        }))
    }

    game.time = Date.now();
    animate(game);
}

function animate(game: {
    canvas: HTMLCanvasElement;
    time: number;
    movers: Mover[];
    gravity: number;
}) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) / 1000; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);


    for (const mover of game.movers) {

        let acc = mover.applyForces(game.movers);
        if (game.gravity === 1)                // Gravity
            acc = Vec2D.J.mult(9.80665e+1);
        if (game.gravity === 2)                // Wind
            acc = Vec2D.I.mult(9.80665e+1);

        mover.update(dt, acc);
        if (game.gravity !== 1)
            mover.limitVelocity(50);
        else 
            mover.limitVelocity(200);

        mover.checkWalls(game.canvas.width, game.canvas.height, game.gravity == 2 ? false: true);
        mover.checkMovers(game.movers);
        mover.render(game.canvas);

        if (mover === game.movers[0])
            console.log(mover.velocity)
    }

    requestAnimationFrame(() => animate(game));
}