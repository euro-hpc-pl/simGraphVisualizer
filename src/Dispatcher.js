/* global sgv */

var Dispatcher = {};


Dispatcher.graphDeleted = ()=>{
    sgv.SPS.reset();
    sgv.SPS.refresh();
    sgv.dlgCPL.setModeSelection();
    sgv.dlgModuleView.hide();
};

Dispatcher.graphChanged = ()=>{
    sgv.dlgCPL.updateSliders();
    sgv.dlgModuleView.refresh();
    sgv.SPS.refresh();
};

Dispatcher.currentScopeChanged = ()=>{
    sgv.dlgCPL.updateSliders();
    sgv.dlgModuleView.refresh();
    sgv.SPS.refresh();
};

Dispatcher.viewModeChanged = ()=>{
    sgv.dlgModuleView.refresh();
    sgv.SPS.refresh();
};
