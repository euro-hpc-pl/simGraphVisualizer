/**
 * Constructs a GraphSize object.
 * @constructor
 * @param {number} c - The number of columns.
 * @param {number} r - The number of rows.
 * @param {number} l - The number of layers.
 * @param {number} kl - The K left parameter.
 * @param {number} kr - The K right parameter.
 */
var GraphSize = (function(c, r, l, kl, kr) {
    this.cols = c;
    this.rows = r;
    this.lays = l;
    this.KL = kl;
    this.KR = kr;
});

/**
 * Constructs a GraphDescr object.
 * @constructor
 */
var GraphDescr = (function() {
    this.size = new GraphSize(0,0,0,0,0);

    /**
     * Sets the type and size of the graph.
     * @param {string} _t - The type of the graph.
     * @param {number} _c - The number of columns.
     * @param {number} _r - The number of rows.
     * @param {number} _l - The number of layers.
     * @param {number} _kl - The K left parameter.
     * @param {number} _kr - The K right parameter.
     */
    this.set = function(_t, _c, _r, _l, _kl, _kr) {
        this.setType(_t);
        this.setSize(_c, _r, _l, _kl, _kr);
    };
    
    /**
     * Sets the type of the graph.
     * @param {string} _t - The type of the graph.
     */
    this.setType = function(_t) {
        this.type = _t;
    };

    /**
     * Sets the size of the graph.
     * @param {number} _c - The number of columns.
     * @param {number} _r - The number of rows.
     * @param {number} _l - The number of layers.
     * @param {number} _kl - The K left parameter.
     * @param {number} _kr - The K right parameter.
     */
    this.setSize = function(_c, _r, _l, _kl, _kr) {
        this.size = new GraphSize( _c, _r, _l, _kl, _kr );
    };
});
