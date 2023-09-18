import { Utils } from "./utils.js"
import Mover from "./mover.js";
import Vec2D from "./vec2d.js";

window.addEventListener('load', init);

function init() {
    const game = {
        canvas: window.document.querySelector('canvas')!,
        time: 0,
        movers: new Array<Mover>,
        gravitor: new Mover({ radius: 0 }),
        attract: false,
    };
    
    game.canvas.addEventListener("mousedown", () => game.attract = !game.attract);

    Utils.resizeCanvas(game.canvas);

    game.gravitor = new Mover({
        radius: 50,
        position: new Vec2D(game.canvas.width / 2, game.canvas.height / 2),
        velocity: Vec2D.fromAngle(Math.random() * Math.PI * 2, Math.random() * 30 + 30),
    });

    for (let i = 0; i < 1000; ++i) {
        game.movers.push(new Mover({
            radius: Math.random() * 20 + 10,
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
    gravitor: Mover;
    attract: boolean;
}) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) / 1000; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    game.gravitor.update(dt);
    game.gravitor.checkWalls(game.canvas.width, game.canvas.height, false);
    game.gravitor.render(game.canvas, "red");

    for (const mover of game.movers) {

        const newAcc = (game.attract
            ? game.gravitor.position.sub(mover.position)
            : mover.position.sub(game.gravitor.position))
            .normalize()
            .mult(game.gravitor.mass * 10)
            .div(mover.position.dist(game.gravitor.position));
        mover.update(dt, newAcc);
        mover.limitVelocity(50);
        mover.checkWalls(game.canvas.width, game.canvas.height);
        mover.render(game.canvas);
    }

    console.log(game.movers[0].velocity.magSq());

    requestAnimationFrame(() => animate(game));
}