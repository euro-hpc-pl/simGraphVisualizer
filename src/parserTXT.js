
/* global sgv, NaN, Graph */

"use strict";

var ParserTXT = {};

ParserTXT.importGraph = (string) => {
    var struct = new TempGraphStructure();

    var res = [];
    var lines = string.split("\n");

    let gDesc = new GraphDescr();
    
    var parseComment = function (string) {
        var command = string.split("=");
        if (command[0] === 'type') {
            gDesc.setType(command[1]);
        } else if (command[0] === 'size') {
            var size = command[1].split(",");
            if (size.length >= 5) {
                gDesc.setSize(
                    parseInt(size[0], 10),
                    parseInt(size[1], 10),
                    parseInt(size[2], 10),
                    parseInt(size[3], 10),
                    parseInt(size[4], 10));
            } else if (size.length === 4) {
                gDesc.setSize(
                    parseInt(size[0], 10),
                    parseInt(size[1], 10),
                    1,
                    parseInt(size[2], 10),
                    parseInt(size[3], 10));
            }
        }
    };

    var parseData = function (string) {
        var line = string.trim().split(/\s+/);
        if (line.length < 3) return null;
        
        let _n1 = parseInt(line[0], 10);
        let _n2 = parseInt(line[1], 10);
        let _val = parseFloat(line[2], 10);

        if (isNaN(_n1)||isNaN(_n2)) return null;    
        else return { n1: _n1, n2: _n2, val: _val };
    };

    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            let d = parseData(lines[0]);
            if (d !== null) {
                res.push(d);
                if (d.n1 === d.n2) {
                    struct.addNode1(d.n1, d.val);
                } else {
                    struct.addEdge1(d.n1, d.n2, d.val);
                }
            }
        } else {
            let line = lines[0].trim().split(/\s+/);
            if (line.length > 1) parseComment(line[1]);
        }
        lines.shift();
    }

    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', struct);
    } else {
        Graph.create( gDesc, struct );
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
