/* global sgv */

var Dispatcher = {};

Dispatcher.graphDeleted = ()=>{
    sgv.SPS.reset();
    sgv.SPS.refresh();
    sgv.dlgMissingNodes.delAll();
    sgv.dlgCPL.setModeSelection();
    sgv.dlgCellView.hide();

    //interface to desktop application
    enableMenu('menuGraphSave', false);
    enableMenu('menuGraphClear', false);
    enableMenu('menuViewDisplayMode', false);
    enableMenu('menuViewCellView', false);
};

Dispatcher.graphCreated = ()=>{
    sgv.dlgCellView.hide();
    sgv.dlgCPL.setModeDescription();
    sgv.graf.displayValues();
    hideSplash();
    
    //interface to desktop application
    enableMenu('menuGraphSave', true);
    enableMenu('menuGraphClear', true);
    enableMenu('menuViewDisplayMode', true);
    enableMenu('menuViewCellView', true);
};

Dispatcher.graphChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

Dispatcher.currentScopeChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

Dispatcher.viewModeChanged = ()=>{
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};
