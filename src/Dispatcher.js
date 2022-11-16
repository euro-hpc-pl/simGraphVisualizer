/* global sgv */

var Dispatcher = {};

Dispatcher.graphDeleted = ()=>{
    sgv.SPS.reset();
    sgv.SPS.refresh();
    sgv.dlgCPL.setModeSelection();
    sgv.dlgCellView.hide();
};

Dispatcher.graphChanged = ()=>{
    sgv.dlgCPL.updateSliders();
    sgv.dlgCellView.refresh();
    sgv.SPS.refresh();
};

Dispatcher.currentScopeChanged = ()=>{
    sgv.dlgCPL.updateSliders();
    sgv.dlgCellView.refresh();
    sgv.SPS.refresh();
};

Dispatcher.viewModeChanged = ()=>{
    sgv.dlgCellView.refresh();
    sgv.SPS.refresh();
};
