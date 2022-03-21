"use strict";
/* global scene, sgv */

sgv.console = new function () {
    var domConsole;
    var isDown;
    var cmdHistory = [];
    var cmdHistoryPtr = -1;
    var movable = false;
//    function privateMethod () {
    // ...
//    }

    function parseCommand(line) {
        function set(node, value) {
            var id = parseInt(node, 10);
            var val = parseFloat(value);

            if (!isNaN(id) && !isNaN(val)) {
                if (sgv.graf !== null) {
                    if (id in sgv.graf.nodes) {
                        sgv.graf.setNodeValue(id, val);
                        return "modified node q" + id + " = " + val;
                    } else {
                        sgv.graf.addNode(id, val);
                        return "added node q" + id + " = " + val;
                    }
                } else {
                    return "no graph defined";
                }
            }
        }

        function del(node) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                let id = parseInt(node, 10);
                if (isNaN(id) || (id === 0)) {
                    return "bad NodeId";
                } else if (id in sgv.graf.nodes) {
                    sgv.graf.delNode(id);
                    return "deleted node q" + id;
                } else {
                    return "node q" + id + " not exists";
                }
            }
        }

        function create(type, sizeTXT) {
            if (sgv.graf === null) {
                switch (type) {
                    case "chimera":
                        sgv.graf = new Chimera(sgv.scene);
                        break;
                    case "pegasus":
                        sgv.graf = new Pegasus(sgv.scene);
                        break;
                    default:
                        return "unknown graph type";
                }

                let sizesTXT = sizeTXT.split(",");
                let size = [0, 0, 0, 0];

                size[0] = parseInt(sizesTXT[0], 10);
                size[1] = parseInt(sizesTXT[1], 10);
                size[2] = parseInt(sizesTXT[2], 10);
                size[3] = parseInt(sizesTXT[3], 10);

                // TU JESZCZE SPRAWDZAĆ PORAWNOŚĆ TYCH WARTOŚCI !!!! 

                sgv.graf.setSize(size[0], size[1], size[2], size[3]);
                sgv.graf.createNew();

                sgv.controlPanel.setModeDescription();

                return "graph created";
            } else {
                return "graf exists, type: clear <Enter> to delete it";
            }

        }

        function clear() {
            sgv.controlPanel.removeGraph();
            return "graph removed";
        }

        function con(node1, node2, value) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                let id1 = parseInt(node1, 10);
                let id2 = parseInt(node2, 10);
                var val = parseFloat(value);

                if (isNaN(id1) || (id1 === 0) || isNaN(id2) || (id2 === 0)) {
                    return "bad node";
                } else if (isNaN(val)) {
                    return "bad value";
                } else if (id1 in sgv.graf.nodes) {
                    if (id2 in sgv.graf.nodes) {
                        sgv.graf.addEdge(id1, id2, val);
                        return "added edge: q" + id1 + " -> g" + id2;
                    } else {
                        return "node q" + id2 + " was probably deleted earlier";
                    }

                } else {
                    return "node q" + id1 + " was probably deleted earlier";
                }
            }
        }

        function set2(command) {
            function setN(split2, val) {
                if (split2[0][0] === 'q') {
                    let id = parseInt(split2[0].slice(1), 10);

                    if (isNaN(id) || (id === 0) || (id > sgv.graf.maxNodeId())) {
                        return "bad node Id";
                    }

                    if (isNaN(val)) {
                        if (id in sgv.graf.nodes) {
                            sgv.graf.delNode(id.toString());
                            return "deleted node q" + id;
                        } else {
                            return "node q" + id + " already deleted";
                        }
                    } else {
                        if (id in sgv.graf.nodes) {
                            sgv.graf.setNodeValue(id, val);
                            return "modified node q" + id + " = " + val;
                        } else if (id in sgv.graf.missing) {
                            sgv.graf.restoreNode(id);
                            let but = document.getElementById("rest" + id);
                            but.parentNode.removeChild(but);
                            sgv.graf.setNodeValue(id, val);
                            return "restored and modified node q" + id + " = " + val;
                        } else {
                            sgv.graf.addNode(id, val);
                            return "added node q" + id + " = " + val;
                        }
                    }
                }
            }

            function setE(split2, val) {
                if ((split2[0][0] === 'q') && (split2[1][0] === 'q')) {
                    let id1 = parseInt(split2[0].slice(1), 10);
                    let id2 = parseInt(split2[1].slice(1), 10);

                    if (isNaN(id1) || (id1 === 0)) {
                        return "bad node Id: " + split2[0];
                    }

                    if (isNaN(id2) || (id2 === 0)) {
                        return "bad node Id: " + split2[1];
                    }

                    let strId = "" + id1 + "," + id2;
                    if (id1 > id2) {
                        strId = "" + id2 + "," + id1;
                    }

                    if (isNaN(val)) {
                        if (strId in sgv.graf.edges) {
                            sgv.graf.delEdge(strId);
                            return "deleted edge " + strId;
                        } else {
                            return "edge " + strId + " not exists";
                        }
                    } else {
                        if (strId in sgv.graf.edges) {
                            sgv.graf.setEdgeValue(strId, val);
                            return "modified edge " + strId;
                        } else {
                            if ((id1 in sgv.graf.nodes) && (id2 in sgv.graf.nodes)) {
                                sgv.graf.addEdge(id1, id2, val);
                                return "added edge " + strId;
                            } else {
                                return "NOT DONE: both connected nodes must exist in the graph";
                            }
                        }
                    }
                }
            }

            if (sgv.graf === null) {
                return "no graph defined";
            }

            let split1 = command.split('=');
            console.log(split1);

            if (split1.length < 2) {
                return "too few arguments";
            }

            let val = parseFloat(split1[1]);
            // if NaN -> delete

            let split2 = split1[0].split('+');

            if (split2.length === 1) { // set node
                return setN(split2, val);
            } else if (split2.length === 2) { //set edge
                return setE(split2, val);
            }

            return "bad arguments";
        }

        function display(valId) {
            return "displayed value: " + sgv.graf.displayValues(valId);
        }
        
        function getHelp(command) {
            switch (command) {
                case "set":
                    return "Set or remove value of node or edge\n\nset [nodeId](=value)\nset [nodeId]+[nodeId](=value)";
                case "create":
                    return "Create new default graph\n\ncreate [chimera|pegasus] [4|8|12|16],[4|8|12|16],[1..4],[1..4]";
                case "clear":
                    return "Remove current graph if exists\n\nclear";
                case "display":
                    return "Switch between sets of displayed values\n\ndisplay [valueId]";
                case "displaymode":
                    return "Set style of graph display.\n\ndisplaymode [classic|triangle|diamond]";
                case "":
                default:
                    return "For more information on a specific command, type: help command-name\n\nset\t\tSet or remove value of node or edge\ncreate\t\tCreate new default graph\nclear\t\tRemove current graph if exists\ndisplay\t\tSwitch between sets of displayed values\ndisplaymode\tSet style of graph display";
            }
        }

        line = line.trim().toLowerCase().replace(/\s+/g, ' ');
        var command = line.split(' ');

        let sp = line.indexOf(' ');
        var polecenie = line.substring(sp + 1).replace(/\s+/g, '');

        var result = "";

        switch (command[0].trim()) {
            case "help":
            case "?":
                result = getHelp(command[1]);
                break;
            case "create":
                result = create(command[1], command[2]);
                break;
            case "clear":
                result = clear();
                break;
            case "set":
                result = set2(polecenie);
                break;
//            case "set":
//                result = set(command[1], command[2]);
//                break;
//            case "delete":
//            case "del":
//                result = del(command[1]);
//                break;
//            case "connect":
//            case "con":
//                result = con(command[1], command[2], command[3]);
//                break;
            case "display":
                result = display(command[1]);
                break;
            case "displaymode":
                if ((command[1]==='classic')||(command[1]==='diamond')||(command[1]==='triangle')) {
                    sgv.displayMode = command[1];
                    sgv.graf.changeDisplayMode();
                    result = "current displayMode = " + command[1];
                } else {
                    result = "unknown mode\n\n" + getHelp('displaymode');
                }
                break;
            default:
                result = "unknown command\n\n" + getHelp();
                break;
        }

        return result;
    }


    return {// public interface

        switchConsole: function () {
            if (domConsole.style.display !== "block") {
                domConsole.style.display = "block";
            } else {
                domConsole.style.display = "none";
            }
        },

        showConsole: function () {
            domConsole.style.display = "block";
        },

        hideConsole: function () {
            domConsole.style.display = "none";
        },

        makeMovable: function () {
            document.getElementById("consoleHandler").style.cursor='pointer';
            movable = true;
        },

        makeUnmovable: function () {
            movable = false;
        },

        initConsole: function (id) {
            //console.log("you are in: myConsole.initConsole()");
            domConsole = document.getElementById(id);
            var domCmdline = document.getElementById("commandline");
            var offset;

            domCmdline.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    let txtarea = document.getElementById("consoleHistory");
                    //txtarea.disabled = false;
                    txtarea.textContent += "> " + domCmdline.value + "\n";

                    txtarea.textContent += parseCommand(domCmdline.value) + "\n";

                    txtarea.scrollTop = txtarea.scrollHeight;
                    //txtarea.disabled = true;

                    if (cmdHistory.length > 10)
                        cmdHistory.shift();
                    cmdHistory.push(domCmdline.value);
                    cmdHistoryPtr = cmdHistory.length;

                    domCmdline.value = "";
                } else if (event.keyCode === 38) {
                    if (cmdHistoryPtr > 0) {
                        cmdHistoryPtr--;
                        domCmdline.value = cmdHistory[cmdHistoryPtr];
                    }
                } else if (event.keyCode === 40) {
                    if (cmdHistoryPtr < cmdHistory.length) {
                        domCmdline.value = cmdHistory[cmdHistoryPtr];
                        cmdHistoryPtr++;
                    } else {
                        domCmdline.value = "";
                    }
                }
            });


            domConsole.addEventListener('mousedown', function (e) {
                isDown = movable;
                offset = {
                    x: domConsole.offsetLeft - e.clientX,
                    y: domConsole.offsetTop - e.clientY
                };
            }, true);

            domConsole.addEventListener('mouseup', function () {
                isDown = false;
            }, true);

            document.addEventListener('mousemove', function (event) {
                event.preventDefault();
                if (isDown) {
                    let mousePosition = {
                        x: event.clientX,
                        y: event.clientY
                    };

                    domConsole.style.left = (mousePosition.x + offset.x) + 'px';
                    domConsole.style.top = (mousePosition.y + offset.y) + 'px';
                }
            }, true);
        }

    };
};