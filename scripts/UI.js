// resize

function resize() {
    canvas.width  = document.documentElement.clientWidth  * 3 / 5;
    canvas.height = document.documentElement.clientHeight * 3 / 4;

    ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
}

resize();

window.onresize = resize;

// planet settings

let selected = null;

canvas.addEventListener("click", event => {
    const x = event.pageX - canvas.getBoundingClientRect().left;
    const y = event.pageY - canvas.getBoundingClientRect().top;

    for (let object of objects) {
        if (hypot(object.x + canvas.width / 2 - x, object.y + canvas.height / 2 - y) < object.radius) {
            selected = object;

            planetName.disabled = planetColor.disabled = planetMass.disabled = deleteButton.disabled = false;

            planetName.value = selected.name;
            planetColor.value = selected.color;
            planetMass.value = selected.mass;

            return;
        }
    }

    selected = null;

    planetName.value = `не выбрано`;
    planetName.disabled = planetColor.disabled = planetMass.disabled = deleteButton.disabled = true;

})

// name

planetName.value = `не выбрано`;
planetName.disabled = true;
planetName.addEventListener("change", () => selected.name = planetName.value);

// color

planetColor.value = "#FFFFFF"
planetColor.disabled = true;
planetColor.addEventListener("change", () => selected.color = planetColor.value);

// mass

planetMass.value = 0;
planetMass.disabled = true;
planetMass.addEventListener("change", () => selected.mass = mass.value)

// delete

deleteButton.addEventListener("click", () => { 
    const index = objects.indexOf(selected);
    
    if (index == -1) return;

    objects.splice(index, 1);

    planetName.value = `не выбрано`;
    planetName.disabled = planetColor.disabled = planetMass.disabled = deleteButton.disabled = true;
});