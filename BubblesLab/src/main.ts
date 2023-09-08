import Vec2D from "./vec2d.js";
import Bubble from "./bubble.js";

window.addEventListener('load', init);

function resiveCanvas(canvas: HTMLCanvasElement) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
}

function init() {
    const game = {
        canvas: window.document.querySelector('canvas')!,
        bubbles: Array<Bubble>(200),
        attractor: new Bubble(0),
        repulser: new Bubble(0),
        time: 0,
    }

    resiveCanvas(game.canvas);


    const width = game.canvas.width,
        height = game.canvas.height,
        diagonal = Math.sqrt(width ** 2 + height ** 2),
        scale = diagonal / 2202.90717008;

    for (let i = 0; i < 200; ++i) {
        const pos = new Vec2D(Math.random() * width, Math.random() * height),
            vel = new Vec2D((Math.random() - 0.5) * width / 10 * scale, (Math.random() - 0.5) * height / 10 * scale),
            radius = (Math.random() * 0.5 + 0.5) * 30 * scale;
        game.bubbles[i] = new Bubble(radius, pos, vel);
    };
    game.attractor = new Bubble(
        30,
        new Vec2D(Math.random() * width, Math.random() * height),
        Vec2D.fromAngle(Math.random() * Math.PI * 2).setMagnitude(5),
    );
    game.repulser = new Bubble(
        30,
        new Vec2D(Math.random() * width, Math.random() * height),
        Vec2D.fromAngle(Math.random() * Math.PI * 2).setMagnitude(5),
    );

    game.time = Date.now();
    animate(game);
}

function animate(game: {canvas: HTMLCanvasElement; bubbles: Bubble[]; attractor: Bubble; repulser: Bubble; time: number;}) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) / 1000; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    game.bubbles.forEach((bubble) => {
        bubble.update(Bubble.CHECK_WALLS(game.canvas.width, game.canvas.height));
        bubble.update(Bubble.VERLET_UPDATE(dt));
        bubble.update(Bubble.CHECK_OVERLAP(game.bubbles, "pink"));
        bubble.render(game.canvas);
        bubble.update(Bubble.SET_OVERLAPPING_FALSE);
        bubble.update(Bubble.SET_COLOR("black"));
    });
    
    requestAnimationFrame(() => animate(game));
}