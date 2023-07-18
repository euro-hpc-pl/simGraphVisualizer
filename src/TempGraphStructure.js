/**
 * @class This class represents a temporary structure for storing graph data. It provides methods
 * for adding edges and nodes to the structure.
 */
var TempGraphStructure = (function() {

    /** @property {Array} nodes - An array for storing nodes. */
    this.nodes = [];

    /** @property {Array} edges - An array for storing edges. */
    this.edges = [];
    
    /**
     * Function to add an edge to the structure with a single value.
     *
     * @param {number} _n1 - The ID of the first node of the edge.
     * @param {number} _n2 - The ID of the second node of the edge.
     * @param {number} _value - The value of the edge.
     */
    this.addEdge1 = function(_n1, _n2, _value) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: {
                'default': _value
            }
        });
    };

    /**
     * Function to add an edge to the structure with multiple values.
     *
     * @param {number} _n1 - The ID of the first node of the edge.
     * @param {number} _n2 - The ID of the second node of the edge.
     * @param {Object} _values - The values of the edge.
     */
    this.addEdge2 = function(_n1, _n2, _values) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: _values
        });
    };
    
    /**
     * Function to add a node to the structure with a single value.
     *
     * @param {number} _id - The ID of the node.
     * @param {number} _value - The value of the node.
     * @param {?string} _label - The label of the node.
     */
    this.addNode1 = function(_id, _value, _label) {
        let node = {
            id: _id,
            values: {
                'default': _value
            },
            label: null
        };
        
        if (typeof _label !== 'undefined') {
            node.label = {
                text: _label,
                enabled: true
            };
        }
        
        this.nodes.push( node );
    };

    /**
     * Function to add a node to the structure with multiple values.
     *
     * @param {number} _id - The ID of the node.
     * @param {Object} _values - The values of the node.
     * @param {?string} _label - The label of the node.
     */
    this.addNode2 = function(_id, _values, _label) {
        let node = {
            id: _id,
            values: _values,
            label: null
        };
        
        if (typeof _label !== 'undefined') {
            node.label = {
                text: _label,
                enabled: true
            };
        }
        
        this.nodes.push( node );
    };

});
