/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global URL, scene */

var download = function(text, name, type) {
    //var a = document.getElementById("mysaver");
    let a = document.createElement("a");
    let file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
};

var toTXT = function(graph) {
    var string = "# type=" + graph.type + "\n";
    string += "# size=" + graph.cols + "," + graph.rows + "," + graph.KL + "," + graph.KR + "\n";

    for (const key in graph.nodes) {
        string +=  key + " " + key + " ";
        string += graph.nodes[key].value + "\n";
    }
    
    for (const key in graph.edges) {
        string += graph.edges[key].begin + " " + graph.edges[key].end + " ";
        string += graph.edges[key].value + "\n";
    }
    
    //console.log(string);
    
    download(string, 'graphDefinition.txt', 'text/plain');
};

let graphType = '';
let graphSize = [0,0,0,0];

var parseComment = function(string) {
    var command = string.split("=");
    if (command[0] === 'type'){
        graphType = command[1];
    }
    else if (command[0] === 'size'){
        var size = command[1].split(",");
        graphSize[0] = parseInt(size[0], 10);
        graphSize[1] = parseInt(size[1], 10);
        graphSize[2] = parseInt(size[2], 10);
        graphSize[3] = parseInt(size[3], 10);
    }
};

var parseData = function(string) {
    var line = string.split(" ");
    if (line.length===3) {
        return {
                n1: parseInt(line[0], 10),
                n2: parseInt(line[1], 10),
                val: parseFloat(line[2], 10)
            };
    }
    else {
        return null;
    }
};

var fromTXT = function(string) {
    var res = [];
    var lines = string.split("\n");
            
    graphType = '';
    graphSize = [0,0,0,0];

    while(lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            var d = parseData( lines[0] );
            if (d!==null) {
                res.push( d );
            }
        }
        else {
            var line = lines[0].split(" ");
            parseComment(line[1]);
        }
        lines.shift();
    }
      
    // graphType==='chimera'
    //var nowyGraf = new Chimera(scene);
    graf = new Chimera(scene);
    
    if (graphSize[0]===0){
        //nowyGraf.setSizeFromWindow();
        graf.setSizeFromWindow();
    }
    else {
        //nowyGraf.setSize(graphSize[0],graphSize[1],graphSize[2],graphSize[3]);
        graf.setSize(graphSize[0],graphSize[1],graphSize[2],graphSize[3]);
    }
    
    //nowyGraf.fromDef(res);
    graf.fromDef(res);

    //graf.rescale(res);
    //console.log(res);
            
    //console.log(nowyGraf);
    
    //return nowyGraf;
};