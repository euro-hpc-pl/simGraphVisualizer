const fs = require('fs');
const path = require('path');

let load = mypath => {
  if (fs.existsSync(mypath)) {
    let data = fs.readFileSync(mypath,{encoding:'utf8', flag:'r'});

    if (data !== '') {
      return data;
    } else
        return null;
  } else {
    return null;
  }
};

let save = (mypath, data) => {
  fs.writeFileSync(mypath, data);
  return true;
};

let loadToStruct = (mypath) => {
    var string = load(mypath);
    if (string===null) return null;
    
    var result = {
        nodes: {},
        edges: {}
    };

    var lines = string.split("\n");

    var parseData = function (string) {
        var line = string.split(" ");
        if (line.length === 3) {
            return {
                n1: parseInt(line[0], 10),
                n2: parseInt(line[1], 10),
                val: parseFloat(line[2], 10)
            };
        } else {
            return null;
        }
    };

    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            var d = parseData(lines[0]);
            if (d !== null) {
                if (d.n1===d.n2) {
                    result.nodes[d.n1] = d.val;
                } else {
                    result.edges[{ n1: d.n1, n2: d.n2 }] = d.val;
                }
            }
        }
        lines.shift();
    }
};

let stringToStruct = (string) => {
    if ((typeof string==='undefined')||(string===null)) return null;
    
    var result = {
        nodes: {},
        edges: {}
    };

    var lines = string.split("\n");

    var parseData = function (string) {
        var line = string.split(" ");
        if (line.length === 3) {
            return {
                n1: parseInt(line[0], 10),
                n2: parseInt(line[1], 10),
                val: parseFloat(line[2], 10)
            };
        } else {
            return null;
        }
    };

    while (lines.length > 0) {
        if (lines[0][0] !== '#')
        {
            var d = parseData(lines[0]);
            if (d !== null) {
                if (d.n1===d.n2) {
                    result.nodes[d.n1] = d.val;
                } else {
                    result.edges[{ n1: d.n1, n2: d.n2 }] = d.val;
                }
            }
        }
        lines.shift();
    }
};

const txtFile = {
  save: save,
  load: load,
  loadToStruct: loadToStruct,
  stringToStruct: stringToStruct
};

module.exports = txtFile;
