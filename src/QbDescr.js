"use strict";

/**
 * Constructs a QbDescr object and returns it.
 * @function
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} i - Either 0 or 1
 * @param {number} j - Either 0 or 1
 * @param {number} k - Either 0 or 1
 * @returns {QbDescr}
 */
const qD = function (x, y, z, i, j, k) {
    return new QbDescr(x, y, z, i, j, k);
};

/**
 * @class Represents the QbDescr.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} i - Either 0 or 1
 * @param {number} j - Either 0 or 1
 * @param {number} k - Either 0 or 1
 */
const QbDescr = (function (x, y, z, i, j, k) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.j = j;
    this.k = k;

    /**
     * Returns the value for n0.
     * @returns {number}
     */
    this.n0 = function () {
        return (((this.i << 1) + this.j) << 1) + this.k;
    };

    /**
     * Returns the value for n1.
     * @returns {number}
     */
    this.n1 = function () {
        return (((this.i << 1) + this.j) << 1) + this.k + 1;
    };

    /**
     * Returns the node ID.
     * @param {number} rows - The number of rows.
     * @param {number} cols - The number of columns.
     * @returns {number}
     */
    this.toNodeId = function(rows, cols) {
        return 8 * (this.x + (this.y + this.z * rows) * cols) + this.n1();
    };

});

/**
 * Static method to create a QbDescr object from a given node ID, rows and columns.
 * @function
 * @static
 * @param {number} nodeIdA - The node ID.
 * @param {number} rows - The number of rows.
 * @param {number} cols - The number of columns.
 * @returns {QbDescr}
 */
QbDescr.fromNodeId = function (nodeIdA, rows, cols) {
    let nodeId = nodeIdA - 1;

    let n = nodeId % 8;

    let k = n % 2;
    let j = (n >> 1) % 2;
    let i = (n >> 2) % 2;

    let modId = nodeId >> 3;

    let layerSize = cols * rows;

    let z = Math.floor(modId / layerSize);

    let modIdInLayer = modId % layerSize;
    let y = Math.floor(modIdInLayer / cols);
    let x = modIdInLayer % cols;
    
    let q =new QbDescr(x, y, z, i, j, k);
    
    return q;
};
