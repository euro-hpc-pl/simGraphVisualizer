
"use strict";
/* global BABYLON, greenMat, redMat, grayMat0, grayMat1, advancedTexture, sgv */

/**
 * Create a new label with given id at the specified position.
 * @param {number|string} id - The id of the label to be created.
 * @param {BABYLON.Vector3} position - The position where the label will be created.
 * @returns {Label} The created Label instance.
 */
const createLabel = function(id, position) {
    return new Label("q" + id, "q" + id, position);
};

/**
 * @class
 * @classdesc Represents a Node in the graph. Each Node has various properties including its id, position, label, etc.
 * @memberOf sgv.Graph
 * 
 * @constructor
 * @param {object} graf - The parent graph this node belongs to.
 * @param {number|string} id - The id of the node.
 * @param {number} x - The x-coordinate of the node's position.
 * @param {number} y - The y-coordinate of the node's position.
 * @param {number} z - The z-coordinate of the node's position.
 * @param {object} _values - The initial values of the node.
 */
var Node = /** @class */ (function(graf, id, x, y, z, _values) {
    var name = "node:" + id;

    this.parentGraph = graf;
    
    if (typeof id==='string') id = parseInt(id,10); 
    if (typeof id !== 'number')
        console.warning("Node id should be a number, but is: "+id);
    
    this.id = id;

    this.active = true;
    this._chckedEdges = 0;

    this.labelIsVisible = false;

    this.values = {
        'default' : Number.NaN
    };

    for (const key in _values) {
        this.values[key] = _values[key];
    }

    // Define the 'position' property to be able to get or set the position of the node.
    Object.defineProperty(this, 'position', {
        get() {
            return this.mesh.position;
        },
        set(pos) {
            this.mesh.position.copyFrom(pos);
            if (label.plane !== null) {
                label.plane.position.copyFrom(pos);
            }
        }
    });

    /**
     * Disposes the node by unbinding it and disposing its label.
     * @returns {undefined}
     */
    this.dispose = function() {
        sgv.SPS.unbindNode(this);
        
        if ((label!==null) && (label.plane!==null)) {
            label.plane.dispose();
        }
        delete label;
    };

    /**
     * Clears the node by calling dispose function.
     * @returns {undefined}
     */
    this.clear = function() {
        this.dispose();
    };

    /**
     * Shows or hides the label depending on the argument.
     * @param {boolean} b - If true, the label will be shown; if false, the label will be hidden.
     * @returns {undefined}
     */
    this.showLabel = function(b) {
        if (typeof b!== 'undefined') {
            this.labelIsVisible = b;
        }
        label.setEnabled(this.labelIsVisible && this.parentGraph.labelsVisible);
    };

    /**
     * Sets the label text and visibility status.
     * @param {string} t - The text to set for the label.
     * @param {boolean} b - The visibility status to set for the label.
     * @returns {undefined}
     */
    this.setLabel = function( t, b ) {
        if (typeof b!== 'undefined') {
            this.labelIsVisible = b;
        }
        label.setText(t, this.labelIsVisible && this.parentGraph.labelsVisible);
    };

    /**
     * Returns the visibility status of the label.
     * @returns {boolean} True if the label is visible, false otherwise.
     */
    this.isLabelVisible = function() {
        return this.labelIsVisible;
    };

    /**
     * Returns the text of the label.
     * @returns {string} The text of the label.
     */
    this.getLabel = function() {
        return label.getText();
    };

    /**
     * Moves the node by a given vector.
     * @param {BABYLON.Vector3} diff - The vector to add to the current position of the node.
     * @returns {undefined}
     */
    this.move = function(diff) {
        this.mesh.position.addInPlace(diff);
        //this.updateLabel();
    };

    /**
     * Increments the edge check count of the node.
     * @returns {undefined}
     */
    this.addCheck = function() {
        this._chckedEdges++;
        //mesh.material = sgv.grayMat1;
    };

    /**
     * Decrements the edge check count of the node.
     * @returns {undefined}
     */
    this.delCheck = function() {
        this._chckedEdges--;
        //if (this._chckedEdges === 0)
        //    mesh.material = sgv.grayMat0;
    };

    /**
     * Retrieves the value of the node in the specified scope.
     * @param {string} scope - The scope from which to get the value.
     * @returns {Number|NaN} - The value of the node in the specified scope. If no value is present, NaN is returned.
     */
    this.getValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (this.values.hasOwnProperty(scope)){
            return this.values[scope];
        } else {
            return Number.NaN;
        }
    };

    /**
     * Deletes the value of the node in the specified scope.
     * @param {string} scope - The scope from which to delete the value.
     * @returns {undefined}
     */
    this.delValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            delete this.values[scope];
        }
    };
    
    /**
     * Sets the value of the node in the specified scope.
     * @param {number} val - The value to set.
     * @param {string} scope - The scope in which to set the value.
     * @returns {undefined}
     */
    this.setValue = function(val, scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        this.values[scope] = val;
    };
    
    /**
     * Updates the color of the node based on the value in the specified scope.
     * @param {string} scope - The scope based on which the node color is updated.
     * @returns {undefined}
     */
    this.displayValue = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }

        let color = valueToColor( (scope in this.values)?this.values[scope]:Number.NaN );
        
        if (scope in this.values) {
            if (this.values[scope] < 0) {
                label.setColors({r:255,g:0,b:0,a:0.8}, this.isLabelVisible());
            }
            else if (this.values[scope] > 0) {
                label.setColors({r:0,g:128,b:0,a:0.8}, this.isLabelVisible());
            }
            else {
                label.setColors({r:0,g:0,b:255,a:0.8}, this.isLabelVisible());
            }
        }
        else {
            label.setColors({r:40,g:40,b:40,a:0.5}, this.isLabelVisible());    
        }
        
        
        sgv.SPS.updateNodeValue(this, color);
    };

    /**
     * Returns the color of the node based on the value in the specified scope.
     * @param {string} scope - The scope based on which the node color is returned.
     * @returns {BABYLON.Color4} - The color of the node based on the value in the specified scope.
     */
    this.currentColor = function(scope) {
        if (typeof scope === 'undefined') {
            scope = this.parentGraph.currentScope;
        }
        
        if (scope in this.values) {
            return valueToColor( this.values[scope] );
        } else {
            return new BABYLON.Color4(0.2, 0.2, 0.2);
        }
    };

    /**
     * Returns the mesh ID of the node.
     * @returns {number} - The mesh ID of the node.
     */
    this.meshId = ()=>this.mesh.idx;

    this.mesh = sgv.SPS.bindNode(this, new BABYLON.Vector3( x, y, z ), this.currentColor());
    
    if (this.mesh===null) {
        console.error("Can't bind NodeSPS");
    }
    else {
        var label = createLabel(this.id, this.mesh.position);
    }

});

/**
 * Creates a Node from a QDescr.
 * @param {object} graf - The parent graph this node belongs to.
 * @param {object} qd - The QDescr to use when creating the Node.
 * @returns {Node} The created Node instance.
 */
Node.fromQDescr = (graf, qd)=>{
    let pos = graf.calcPosition2(qd.x, qd.y, qd.z, qd.n0());
    return new Node(graf, qd.toNodeId(graf.rows, graf.cols), pos.x, pos.y, pos.z );
};

/**
 * Creates a Node from XYZ and IJK.
 * @param {object} graf - The parent graph this node belongs to.
 * @param {number} x - The x-coordinate of the node's position.
 * @param {number} y - The y-coordinate of the node's position.
 * @param {number} z - The z-coordinate of the node's position.
 * @param {number} i - The i-coordinate of the node's position.
 * @param {number} j - The j-coordinate of the node's position.
 * @param {number} k - The k-coordinate of the node's position.
 * @returns {Node} The created Node instance.
 */
Node.fromXYZIJK = (graf, x, y, z, i, j, k)=>{
    return Node.fromQDescr(graf, qD(x,y,z,i,j,k));
};

