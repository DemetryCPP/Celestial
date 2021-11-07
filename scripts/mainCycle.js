const objects = [
    new CosmosObject(1000, [ 0, 0 ], [ 0, 0 ]),
    new CosmosObject(5, [ 0, 200 ], [ sqrt(1005/200), 0 ])
]

function step() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    for (let a of objects) {
        for (let b of objects)
            if (a != b)
                a.influence(b);
        
        a.draw();

        a.x += a.vx;
        a.y += a.vy;
    }

    if (newPlanetCoords !== null && editingForAdd) {
        ctx.beginPath();

        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.arc(...newPlanetCoords, 2, 0, 2 * PI);
        ctx.fill();
    }
}

setInterval(step, 20);