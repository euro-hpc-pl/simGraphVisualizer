
sgv.dlgAbout = new function() {
    var ui = null;

    function createDialog() {
        if (ui===null) {
            ui = UI.tag( "dialog", { "class": "sgvUIwindow sgvModalDialog", "id": "sgvDlgAbout" });
        }
        
        var content = UI.tag( "div", { "class": "content" });

        content.style['text-align'] = 'center';
        content.style.width = 'fit-content';
        content.innerHTML += '<div><img src="pics/EuroHPC.jpg"></div>';
        content.innerHTML += '<div>Narodowa Infrastruktura Superkomputerowa dla EuroHPC - EuroHPC PL</div>';
        content.innerHTML += '<div class="info">simGraphVisualizer v.1.0</div>';
        content.innerHTML += '<div><img src="pics/Flagi.jpg"></div>';

        let btn = UI.tag( "input", {
            'type':     "button",
            'value':    "Close",
            'class':    "actionbutton",
            'id':       "closeButton",
            'name':     "closeButton"
        });
        content.appendChild(btn);

        btn.addEventListener('click', function () {
            hideDialog();
        });

        let t = UI.createTitlebar("About", false);
        ui.appendChild(t);
        ui.appendChild(content);

        ui.style.display = "none";
        window.document.body.appendChild(ui);
    };

    function showDialog() {
        if (ui===null) {
            createDialog();
        }
        ui.style.display = "block";

        ui.showModal();
    };

    function hideDialog() {
        ui.close();
        ui.style.display = "none";
    };


    return {
        //ui: ui,
        create: createDialog,
        show: showDialog,
        hide: hideDialog
    };
};



