/* global sgv */

/**
 * @namespace
 * @description This object provides functionality related to dispatching events in the application.
 */
var Dispatcher = {};

/**
 * Triggers UI updates when the graph has been deleted.
 * 
 * @function
 */
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

/**
 * Triggers UI updates when the graph has been created.
 *
 * @function
 */
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

/**
 * Triggers UI updates when the graph has been changed.
 *
 * @function
 */
Dispatcher.graphChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

/**
 * Triggers UI updates when the current scope has been changed.
 *
 * @function
 */
Dispatcher.currentScopeChanged = ()=>{
    sgv.dlgCPL.refresh();
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};

/**
 * Triggers UI updates when the view mode has been changed.
 *
 * @function
 */
Dispatcher.viewModeChanged = ()=>{
    sgv.dlgCellView.refresh();
    sgv.dlgNodeProperties.refresh();
    sgv.dlgEdgeProperties.refresh();
    sgv.SPS.refresh();
};
