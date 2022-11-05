/* global sgv, UI, URL, Chimera, Pegasus */

sgv.stringToScope = (data,newScope) => {
    let r = sgv.graf.loadScopeValues(newScope,data);
            
    if (r.n) {
        sgv.dlgCPL.addScope(newScope);
    }
    sgv.dlgCPL.selScope(newScope);
};

function download(text, name, type) {
    //var a = document.getElementById("mysaver");
    let a = document.createElement("a");
    let file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

sgv.toGEXF = function () {
    var string = sgv.graf.exportGEXF();
    download(string, 'graphDefinition.gexf', 'text/xml');
};

sgv.toTXT = function () {
    var string = sgv.graf.exportTXT();
    download(string, 'graphDefinition.txt', 'text/plain');
};



sgv.fromTXT_BACK = function (string) {
    var res = [];
    var lines = string.split("\n");

    var gDesc = {};
    
    var parseComment = function (string) {
        var command = string.split("=");
        if (command[0] === 'type') {
            gDesc.type = command[1];
        } else if (command[0] === 'size') {
            var size = command[1].split(",");
            gDesc.size = {
                cols: parseInt(size[0], 10),
                rows: parseInt(size[1], 10),
                KL: parseInt(size[2], 10),
                KR: parseInt(size[3], 10)
            };
        }
    };

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
                res.push(d);
            }
        } else {
            var line = lines[0].split(" ");
            parseComment(line[1]);
        }
        lines.shift();
    }

    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', res);
    } else {
        sgv.createGraph( gDesc, res );
    }
};


sgv.fromTXT = function (string) {
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
                res.push(d);
            }
        } else {
            var line = lines[0].split(" ");
            parseComment(line[1]);
        }
        lines.shift();
    }

    if (typeof gDesc.type==='undefined') {
        sgv.dlgCreateGraph.show('load', res);
    } else {
        sgv.createGraph( gDesc, res );
    }
};



sgv.loadGraph = function(selectedFile) {
    const name = selectedFile.name;
    const reader = new FileReader();
    if (selectedFile) {
        reader.addEventListener('error', () => {
            console.error(`Error occurred reading file: ${selectedFile.name}`);
        });

        reader.addEventListener('load', () => {
            console.info(`File: ${selectedFile.name} read successfully`);
            //let name = selectedFile.name;
            if (name.endsWith("txt")) {
                if (sgv.graf!==null) {
                    sgv.removeGraph();
                }
                sgv.fromTXT(reader.result);
            } else if(name.endsWith("gexf")) {
                if (parseGEXF(reader.result)){
                    sgv.setModeDescription();
                }
            } else {
                console.error(`Incorrect file format...`);
            }
        });

        if ( name.endsWith("txt") || name.endsWith("gexf") ) {
            reader.readAsText(selectedFile); 

            //reader.readAsDataURL(selectedFile);
        } else {
            console.error(`Incorrect file extension...`);
        }
    }                    
};
        
sgv.loadGraph2 = function(name,data) {
    if (name.endsWith("txt")) {
        if (sgv.graf!==null) {
            sgv.removeGraph();
        }
        sgv.fromTXT(data);
        //sgv.setModeDescription();
    } else if(name.endsWith("gexf")) {
        if (sgv.graf!==null) {
            sgv.removeGraph();
        }
        if (parseGEXF(data)){
            sgv.setModeDescription();
        }
    };
};
