import { Utils } from "./utils.js";

window.addEventListener('load', init);

function init() {
    const game = {
        canvas: window.document.querySelector('canvas')!,
        time: 0,
    };

    Utils.resizeCanvas(game.canvas);

    game.time = Date.now();
    animate(game);
}

function animate(game: { canvas: HTMLCanvasElement; time: number; }) {
    const currentTime = Date.now();
    const dt = (currentTime - game.time) / 1000; // Delta time bewteen last 'frame' in seconds
    game.time = currentTime;

    const ctx = game.canvas.getContext("2d")!;
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    requestAnimationFrame(() => animate(game));
}