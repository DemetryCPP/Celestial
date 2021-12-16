window.onload = function() {
    const el = document.getElementById('rendererCanvas')
    const menu = document.querySelector(".context-menu");
    const settingsWindow = document.querySelector(".settings");
    const settingsControls = {
        name: document.getElementById('bodyName'),
        mass: document.getElementById('mass'),
        color: document.getElementById('color'),
        vx: document.getElementById('vx'),
        vy: document.getElementById('vy'),
        vz: document.getElementById('vz'),
    }

    function showContextMenu() {
        menu.style.display = "block";
    }

    function showSettings() {
        settingsWindow.style.display = "flex";
        menu.style.display = "none";
    }

    function hideSettings() {
        settingsWindow.style.display = "none";
    }

    function updateBodySettings(body) {
        settingsControls['name'].addEventListener('input', function() {
            body.name = settingsControls['name'].value;
            body.updateMesh()
        });

        settingsControls['color'].addEventListener('input', function() {
            body.color = settingsControls['color'].value;
            body.updateMesh()
        });

        settingsControls['mass'].addEventListener('input', function() {
            body.mass = Number(settingsControls['mass'].value);
            body.updateMesh()
        });

        settingsControls['vx'].addEventListener('input', function() {
            body.vx = Number(settingsControls['vx'].value);
            body.updateMesh()
        });

        settingsControls['vy'].addEventListener('input', function() {
            body.vy = Number(settingsControls['vy'].value);
            body.updateMesh()
        });

        settingsControls['vz'].addEventListener('input', function() {
            body.vz = Number(settingsControls['vz'].value);
            body.updateMesh()
        });
    }

    el.addEventListener( 'contextmenu', function ( e ) {
        event.preventDefault();
        showContextMenu()

        // set position X of the menu
        if ((window.innerWidth - e.clientX) > menu.offsetWidth + 10){
            menu.style.left = e.clientX + "px";
        }
        else
        {
            menu.style.left = (e.clientX - menu.offsetWidth) + "px";
        }
        // set position Y of the menu
        if ((window.innerHeight - e.clientY) > menu.offsetHeight + 10){
            menu.style.top = e.clientY + "px";
        }
        else
        {
            menu.style.top = (e.clientY - menu.offsetHeight) + "px";
        }
    }, false );

    el.addEventListener( 'click', function ( e ) {
        menu.style.display = "none";
        settingsWindow.style.display = "none";
    });

    const confirmBtn = document.getElementById('settingsConfirm');
    confirmBtn.addEventListener('click', function() {
        hideSettings()
    });

    let createBodyBtn = document.getElementById('createBody');

    createBodyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showSettings()

        const confirmBtn = document.getElementById('settingsConfirm');
        confirmBtn.addEventListener('click', function() {
            hideSettings()
            let color = settingsControls['color'].value;
            let name  = settingsControls['name'].value;
            let mass  = settingsControls['mass'].value;
            let vx = Number(settingsControls['vx'].value);
            let vy = Number(settingsControls['vy'].value);
            let vz = Number(settingsControls['vz'].value);

            let body = new CosmosObject(mass, [ 0, 0, 0 ], [ vx, vy, vz ], color, name);

            placeBodyToScene(body);
        });
    })

    let deleteBodyBtn = document.getElementById('deleteBody');

    deleteBodyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        deleteBody(selectedPlanet.name);
    })

    let settingsBtn = document.getElementById('bodySettings');

    settingsBtn.addEventListener('click', function() {
        let selectedObject = bodies[selectedPlanet.name];

        showSettings();
        // Show current body settings
        settingsControls['name'].value = selectedObject.name;
        settingsControls['mass'].value = selectedObject.mass;
        settingsControls['color'].value = selectedObject.color;
        settingsControls['vx'].value = selectedObject.vx;
        settingsControls['vy'].value = selectedObject.vy;
        settingsControls['vz'].value = selectedObject.vz;

        // And listening for changes
        updateBodySettings(selectedObject);
    });
}

