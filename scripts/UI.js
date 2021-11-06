canvas.width  = document.documentElement.clientWidth  * 3 / 5;
canvas.height = document.documentElement.clientHeight * 3 / 4;

window.onresize = () => {
    canvas.width  = document.documentElement.clientWidth  * 3 / 5;
    canvas.height = document.documentElement.clientHeight * 3 / 4;
}