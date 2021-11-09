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

function lockAll() {
    selected = null;
    
    planetName.value    = "не выбрано";
    planetColor.value   = "#FFFFFF"
    planetMass.value    = 0;
    
    planetName.disabled = planetColor.disabled = planetMass.disabled = deleteButton.disabled = true;
}

function unlockAll() {
    planetName.disabled = planetColor.disabled = planetMass.disabled = deleteButton.disabled = false;
}

lockAll();

canvas.addEventListener("click", event => {
    if (editingForAdd)
        return;

    const x = event.pageX - canvas.getBoundingClientRect().left;
    const y = event.pageY - canvas.getBoundingClientRect().top;

    for (let object of objects) {
        if (hypot(object.x + canvas.width / 2 - x, object.y + canvas.height / 2 - y) < object.radius) {
            selected = object;

            planetName.value    = selected.name;
            planetColor.value   = selected.color;
            planetMass.value    = selected.mass;
    
            unlockAll();

            return;
        }
    }

    lockAll();
})

planetName.addEventListener ("change", ()   => editingForAdd ? null : selected.name  = planetName.value);   // name
planetColor.addEventListener("change", ()   => editingForAdd ? null : selected.color = planetColor.value);  // color
planetMass.addEventListener ("change", ()   => {
    if (planetMass.value <= 0) return alert("Масса должна быть больше нуля!");
    editingForAdd ? null : selected.mass  = planetMass.value
});   // mass

deleteButton.addEventListener("click", () => objects.splice(objects.indexOf(selected), 1), lockAll());      // delete

// add button

var editingForAdd = false;
var newPlanetCoords = null;

canvas.addEventListener("click", event => newPlanetCoords = [
    event.pageX - canvas.getBoundingClientRect().left - canvas.width  / 2,
    event.pageY - canvas.getBoundingClientRect().top  - canvas.height / 2
]);

addButton.addEventListener("click", () => {
    if (!editingForAdd) {
        editingForAdd = true;
        unlockAll();
        
        planetName.value = "Planet №" + (planetsCount + 1);
        cancelButton.disabled = false;
    } else {
        if (newPlanetCoords == null)
            return alert("Выберите координаты вашей планеты, кликнув по полю.");

        if (planetMass.value <= 0)
            return alert("Масса должна быть больше нуля");

        objects.push(new CosmosObject(planetMass.value, newPlanetCoords, [0, 0], planetColor.value, planetName.value))
        lockAll();

        editingForAdd = false;
        cancelButton.disabled = true;
    }
});

// cancel button

cancelButton.disabled = true;
cancelButton.addEventListener("click", () => {
    editingForAdd = false;
    lockAll();
    newPlanetCoords = null;
    cancelButton.disabled = true;
});