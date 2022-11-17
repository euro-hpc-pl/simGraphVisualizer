var TempGraphStructure = (function() {
    this.nodes = [];
    this.edges = [];
    
    this.addEdge1 = function(_n1, _n2, _value) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: {
                'default': _value
            }
        });
    };

    this.addEdge2 = function(_n1, _n2, _values) {
        this.edges.push({
            n1: _n1,
            n2: _n2,
            values: _values
        });
    };
    
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
