/* global sgv */

sgv.dlgGraphProperties = new function() {
    var sliderRedLimit, sliderGreenLimit;
    var selectGraphCols, selectGraphRows, selectGraphLays;
    var selectGraphKL, selectGraphKR;
    
    var ui = createUI();

    window.addEventListener('load',()=>{
        window.document.body.appendChild(ui);
        
//        window.document.querySelectorAll('input[type="range"]').forEach((input) => { 
//            input.addEventListener('mousedown',  () => window.getSelection().removeAllRanges());
//        });
        
//        sgv.dlgGraphProperties.show();
    });

    function createUI() {
        let ui = UI.createEmptyWindow("sgvUIwindow", "sgvGraphProperties", "Graph properties", true);

        ui.querySelector(".hidebutton").addEventListener('click', function () {
            hideDialog();
        });
        
        sliderRedLimit = UI.tag('input',{
            'type':'range',
            'id':'redLimit',
            'value':'-1.0',
            'min':'-1.0',
            'max':'0.0',
            'step':'any'
        });
        sliderRedLimit.addEventListener('change', (e)=>{
            if (sgv.graf !== null) {
                sgv.graf.redLimit = e.target.value;
                sgv.graf.displayValues();
            }
        });
        //sliderRedLimit.style.appearance = 'slider-vertical';
        sliderGreenLimit = UI.tag('input',{
            'type':'range',
            'id':'greenLimit',
            'value':'1.0',
            'min':'0.0',
            'max':'1.0',
            'step':'any'
        });
        sliderGreenLimit.addEventListener('change', (e)=>{
            if (sgv.graf !== null) {
                sgv.graf.greenLimit = e.target.value;
                sgv.graf.displayValues();
            }
        });
        //sliderGreenLimit.style.appearance = 'slider-vertical';
        
        ui.appendChild(sliderRedLimit);
        ui.appendChild(sliderGreenLimit);
        
        return ui;
    };
    
    function hideDialog() {
        ui.style.display = "none";
    };
    
    
    return {
        show: ()=>{ui.style.display = "block";},
        hide: hideDialog
    };
};