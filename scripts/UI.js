function resize() {
    canvas.width  = document.documentElement.clientWidth  * 3 / 5;
    canvas.height = document.documentElement.clientHeight * 3 / 4;

    ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
}

resize();
window.onresize = resize;