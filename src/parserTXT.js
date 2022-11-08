/* global sgv, NaN */

"use strict";

var ParserTXT = {};

ParserTXT.importGraph = (string) => {
    var res = [];
    var lines = string.split("\n");

    var gDesc = {};
    
    var parseComment = function (string) {
        var command = string.split("=");
        if (command[0] === 'type') {
            gDesc.type = command[1];
        } else if (command[0] === 'size') {
            var size = command[1].split(",");
            if (size.length >= 5) {
                gDesc.size = {
                    cols: parseInt(size[0], 10),
                    rows: parseInt(size[1], 10),
                    lays: parseInt(size[2], 10),
                    KL: parseInt(size[3], 10),
                    KR: parseInt(size[4], 10)
                };
            } else if (size.length === 4) {
                gDesc.size = {
                    cols: parseInt(size[0], 10),
                    rows: parseInt(size[1], 10),
                    lays: 1,
                    KL: parseInt(size[2], 10),
                    KR: parseInt(size[3], 10)
                };
            }
        }
    };

    var parseData = function (string) {
        var line = string.trim().split(/\s+/);
        if (line.length < 3) return null;
        
        let _n1 = parseInt(line[0], 10);
        let _n2 = parseInt(line[1], 10);
        let _val = parseFloat(line[2], 10);

        if ((_n1===NaN)||(_n2===NaN)) return null;    
        else return { n1: _n1, n2: _n2, val: _val };
    };

    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            let d = parseData(lines[0]);
            if (d !== null) res.push(d);
        } else {
            let line = lines[0].trim().split(/\s+/);
            if (line.length > 1) parseComment(line[1]);
        }
        lines.shift();
    }

    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', res);
    } else {
        sgv.createGraph( gDesc, res );
    }
};

ParserTXT.exportGraph = (graph) => {
    if ((typeof graph==='undefined')||(graph === null)) return null;

    var string = "# type=" + graph.type + "\n";
    string += "# size=" + graph.cols + "," + graph.rows + "," + graph.layers + "," + graph.KL + "," + graph.KR + "\n";

    for (const key in graph.nodes) {
        string += key + " " + key + " ";
        string += graph.nodes[key].getValue() + "\n";
    }

    for (const key in graph.edges) {
        string += graph.edges[key].begin + " " + graph.edges[key].end + " ";
        string += graph.edges[key].getValue() + "\n";
    }

    return string;
};
