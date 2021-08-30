/* global graf */

var switchConsole = function() {
    var con = document.getElementById("konsola");
    if (con.style.display !== "block") {
        con.style.display = "block";
    } else {
        con.style.display = "none";
    }
};

var showConsole = function() {
    document.getElementById("konsola").style.display = "block";
};

var hideConsole = function() {
    document.getElementById("konsola").style.display = "none";
};

var interpreted = function(line) {
    var c=line.split("=");
    if ( ( c.length === 2 ) && ( c[0][0]==='q') ) {
        var id = parseInt(c[0].substring(1),10);
        var val = parseFloat(c[1]);
        
        if ( ! isNaN(id) && ! isNaN(val) ) {
            if (graf !== null) {
                if (id in graf.nodes) {
                    graf.setNodeValue(id, val);
                    return "";
                }
                else {
                    graf.addNode(id, val);
                    return "";
                }
            }
            else {
                return "no graph defined\n";
            }
        }
    }
    
    return "unknown command\n";
};
