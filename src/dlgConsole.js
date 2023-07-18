"use strict";
/* global scene, sgv, Chimera, Pegasus, UI, Graph */


/**
 * @class
 * @classdesc Represents the DlgConsole class.
 * @memberof sgv
 */
class DlgConsole {
    constructor () {
        this.cmdHistory = [];
        this.cmdHistoryPtr = -1;
        this.movable = false;

        /**
        * User interface element representing the console.
        * @type {HTMLElement}
        */    
        this.ui = this.createUI("sgvConsole");

        /**
        * Initializes the console.
        */
        this.initConsole();

        window.addEventListener('load',()=>{
            window.document.body.appendChild(this.ui);
        });
    }

    /**
     * Initializes the console by setting up event listeners for the command line input field.
     * 
     * The function sets up listeners for "Enter", "Up", and "Down" key presses. 
     * "Enter" executes the command written in the input field. 
     * "Up" and "Down" navigate through the command history.
     */
    initConsole() {
        let domCmdline = this.ui.querySelector("#commandline");

        domCmdline.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                let txtarea = document.getElementById("consoleHistory");
                //txtarea.disabled = false;
                txtarea.textContent += "> " + domCmdline.value + "\n";

                txtarea.textContent += this.parseCommand(domCmdline.value) + "\n";

                txtarea.scrollTop = txtarea.scrollHeight;
                //txtarea.disabled = true;

                if (this.cmdHistory.length > 10)
                    this.cmdHistory.shift();
                this.cmdHistory.push(domCmdline.value);
                this.cmdHistoryPtr = this.cmdHistory.length;

                domCmdline.value = "";
            } else if (event.keyCode === 38) {
                if (this.cmdHistoryPtr > 0) {
                    this.cmdHistoryPtr--;
                    domCmdline.value = this.cmdHistory[this.cmdHistoryPtr];
                }
            } else if (event.keyCode === 40) {
                if (this.cmdHistoryPtr < this.cmdHistory.length) {
                    domCmdline.value = this.cmdHistory[this.cmdHistoryPtr];
                    this.cmdHistoryPtr++;
                } else {
                    domCmdline.value = "";
                }
            }
        });

        this.ui.querySelector(".hidebutton").addEventListener('click', () => { this.hideConsole(); });
    }

    /**
     * Creates a new UI window for a console with a specified ID.
     * 
     * @param {string} id - The ID to be assigned to the new window.
     * 
     * @returns {HTMLElement} The created UI window element. The window includes a read-only textarea for the console history and a text input field for the command line.
     */
    createUI(id) {
        var o = UI.createEmptyWindow("sgvUIwindow", id, "console", true);

        o.innerHTML += '<div class="content"> \
                <textarea id="consoleHistory" readonly></textarea> \
                <input type="text" id="commandline"> \
            </div>';
        return o;
    };

    /**
     * Parses and executes a command.
     * 
     * @param {string} line - The command to parse and execute. The command name and its arguments should be separated by whitespace characters.
     * 
     * @returns {string} A string message indicating the result of the operation. The exact message depends on the command and its arguments.
     */
    parseCommand(line) {

        /**
        * Sets the value of a specified node in the graph, if the node exists.
        * 
        * @param {string|number} node - The ID of the node to be modified, either as a string or a number.
        * @param {string|number} value - The new value to be set for the node, either as a string or a number.
        * 
        * @returns {string} A string message indicating the result of the operation. This can be one of the following:
        *    - "modified node q<id> = <value>": If the node value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
        *    - "restored node q<id> = <value>": If the node was restored and its value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
        *    - "not implemented yet": If the node does not exist in the graph and the node adding feature is not yet implemented.
        *    - "no graph defined": If there is no graph defined in the sgv.graf property.
        */
        function set(node, value) {
            var id = parseInt(node, 10);
            var val = parseFloat(value);

            if (!isNaN(id) && !isNaN(val)) {
                if (sgv.graf !== null) {
                    if (id in sgv.graf.nodes) {
                        sgv.graf.setNodeValue(id, val);
                        return "modified node q" + id + " = " + val;
                    } else if ( sgv.dlgMissingNodes.restoreNode(id) ) {
                            sgv.graf.setNodeValue(id, val);
                            return "restored node q" + id + " = " + val;
                    }
                    else {
                        //sgv.graf.addNode(id, val);
                        //return "added node q" + id + " = " + val;
                        return "not implemented yet";
                    }
                } else {
                    return "no graph defined";
                }
            }
        }

        /**
         * Deletes a node from the graph, if it exists. 
         * 
         * @param {string|number} node - The ID of the node to be deleted, either as a string or a number.
         * 
         * @returns {string} A string message indicating the result of the deletion operation. This can be one of the following:
         *    - "no graph defined": If there is no graph defined in the sgv.graf property.
         *    - "bad NodeId": If the provided node ID is not a valid integer or it is zero.
         *    - "deleted node q<id>": If the node was successfully deleted. The <id> placeholder is replaced with the ID of the deleted node.
         *    - "node q<id> not exists": If the node with the provided ID does not exist in the graph. The <id> placeholder is replaced with the non-existent node's ID.
         */
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

        /**
         * Performs a specified action on a scope of the graph.
         * 
         * @param {string} action - The action to be performed. This can be one of the following: 
         *    - "list": Lists all the scopes.
         *    - "add": Adds a new scope.
         *    - "delete": Deletes a specified scope.
         *    - "set": Sets the specified scope as the current scope.
         * @param {string} [scope] - The name of the scope on which the action is to be performed. 
         *    Required for "add", "delete", and "set" actions.
         * 
         * @returns {string} A string message indicating the result of the operation. The actual message depends on the action performed.
         */
        function scope(action, scope) {
            if (sgv.graf === null) {
                return "no graph defined";
            } else {
                switch(action) {
                    case "list":
                        return sgv.graf.scopeOfValues.toString();
                        break;
                    case "add":
                        let idx = sgv.graf.addScopeOfValues(scope);

                        if (idx>=0) {
                            sgv.dlgCPL.addScope(scope,idx);
                            sgv.graf.displayValues(scope);
                        }
                        
                        return "Added scope "+scope;
                        break;
                    case "delete":
                        let idx2 = sgv.graf.delScopeOfValues(scope);
                    
                        if (  idx2 >= 0 ) {
                            sgv.dlgCPL.delScope(scope, idx2);
                            return "Deleted scope "+scope+", current scope: "+sgv.graf.currentScope;
                        }

                        return "Scope "+scope+" could not to be deleted... Current scope: "+sgv.graf.currentScope;
                        break;
                    case "set":
                        if (sgv.graf.hasScope(scope)) {
                            if ( sgv.graf.displayValues(scope) ) {
                                sgv.dlgCPL.selScope(scope);
                            }
                            
                            return "Current scope: "+sgv.graf.currentScope;
                        }
                        return "Bad scope name: "+scope+"... Current scope: "+sgv.graf.currentScope;
                        break;
                    default:
                        return "Current scope: "+sgv.graf.currentScope;
                        break;
                }
            }
        }

        /**
         * Creates a new graph of a specified type and size.
         * 
         * @param {string} type - The type of the graph to be created. This should be either "chimera" or "pegasus".
         * @param {string} sizeTXT - A comma-separated string of numbers representing the size of the graph to be created.
         *    For a "chimera" graph, this should have four or five numbers.
         *    For a "pegasus" graph, this should have five numbers.
         * 
         * @returns {string} A string message indicating the result of the operation. This can be one of the following:
         *    - "unknown graph type, use: chimera or pegasus": If the provided type is not "chimera" or "pegasus".
         *    - "bad arguments": If the sizeTXT parameter does not have the correct number of numbers for the specified type.
         *    - "graph created": If the graph was successfully created.
         *    - "graf exists, type: clear <Enter> to delete it": If a graph already exists.
         */
        function create(type, sizeTXT) {
            if ((type!=='chimera')&&(type!=='pegasus')){
                return "unknown graph type, use: chimera or pegasus";
            }
            if (sgv.graf === null) {
                let gD = new GraphDescr();
                gD.setType(type);
                
                const sizesTXT = sizeTXT.split(",");

                if (sizesTXT.length>=5) {
                    gD.setSize(
                        parseInt(sizesTXT[0], 10),
                        parseInt(sizesTXT[1], 10),
                        parseInt(sizesTXT[2], 10),
                        parseInt(sizesTXT[3], 10),
                        parseInt(sizesTXT[4], 10));
                } else if ((sizesTXT.length===4)&&(type==='chimera')) {
                    gD.setSize(
                        parseInt(sizesTXT[0], 10),
                        parseInt(sizesTXT[1], 10),
                        1,
                        parseInt(sizesTXT[2], 10),
                        parseInt(sizesTXT[3], 10));
                } else {
                    return "bad arguments";
                }
                
                Graph.create(gD);

                return "graph created";
            } else {
                return "graf exists, type: clear <Enter> to delete it";
            }

        }

        /**
        * Removes the graph.
        * 
        * @returns {string} A string message indicating that the graph was removed.
        */
        function clear() {
            Graph.remove();
            return "graph removed";
        }

        /**
         * Connects two nodes in the graph with a specified value, if both nodes exist.
         * 
         * @param {string|number} node1 - The ID of the first node to be connected, either as a string or a number.
         * @param {string|number} node2 - The ID of the second node to be connected, either as a string or a number.
         * @param {string|number} value - The value to be set for the edge connecting the nodes, either as a string or a number.
         * 
         * @returns {string} A string message indicating the result of the operation. This can be one of the following:
         *    - "no graph defined": If there is no graph defined in the sgv.graf property.
         *    - "bad node": If either of the provided node IDs are not valid integers or they are zero.
         *    - "bad value": If the provided value is not a valid number.
         *    - "added edge: q<id1> -> q<id2>": If the edge was successfully added. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
         *    - "node q<id> was probably deleted earlier": If the node with the provided ID does not exist in the graph. The <id> placeholder is replaced with the non-existent node's ID.
         */
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
                        sgv.graf.addEdge(id1, id2).setValue(val);
                        return "added edge: q" + id1 + " -> g" + id2;
                    } else {
                        return "node q" + id2 + " was probably deleted earlier";
                    }

                } else {
                    return "node q" + id1 + " was probably deleted earlier";
                }
            }
        }

        /**
         * Processes a command to set values of nodes or edges in the graph. The command syntax should follow either of the following formats:
         *    - 'q<nodeId>=<value>' to set the value of a node. 
         *    - 'q<nodeId1>+q<nodeId2>=<value>' to set the value of an edge. 
         * If a node or edge does not exist, it will be created. If the value is not a valid number, the function will attempt to delete the node or edge.
         *
         * @param {string} command - The command string to process.
         * 
         * @returns {string} A string message indicating the result of the operation. Possible results include:
         *    - "no graph defined": If no graph is currently defined.
         *    - "too few arguments": If the command does not contain enough arguments.
         *    - "bad arguments": If the command syntax does not match the expected formats.
         *    - Any of the return messages defined in the setN or setE functions.
         */
        function set2(command) {

            /**
             * Sets the value of a specified node in the graph, restores a missing node, adds a new node, or deletes a node, depending on the given parameters.
             * 
             * @param {Array} split2 - An array where the first element is a string representing the node. The node ID should be prefixed with 'q'.
             * @param {string|number} val - The value to be set for the node. If not a valid number, the function will attempt to delete the node.
             * 
             * @returns {string} A string message indicating the result of the operation. This can be one of the following:
             *    - "bad node Id": If the provided node ID is not a valid integer, it is zero, or it is greater than the maximum node ID in the graph.
             *    - "deleted node q<id>": If the node was successfully deleted. The <id> placeholder is replaced with the ID of the deleted node.
             *    - "node q<id> already deleted": If the node with the provided ID does not exist in the graph. The <id> placeholder is replaced with the non-existent node's ID.
             *    - "modified node q<id> = <value>": If the node value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
             *    - "restored and modified node q<id> = <value>": If the node was restored from the missing nodes and its value was successfully modified. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
             *    - "added node q<id> = <value>": If a new node was successfully added with the specified value. The <id> and <value> placeholders are replaced with the node's ID and the new value, respectively.
             */
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

            /**
             * Sets the value of a specified edge in the graph, adds a new edge, or deletes an edge, depending on the given parameters.
             * 
             * @param {Array} split2 - An array where the first two elements are strings representing the nodes to be connected. The node IDs should be prefixed with 'q'.
             * @param {string|number} val - The value to be set for the edge. If not a valid number, the function will attempt to delete the edge.
             * 
             * @returns {string} A string message indicating the result of the operation. This can be one of the following:
             *    - "bad node Id: q<id>": If the provided node ID is not a valid integer or it is zero. The <id> placeholder is replaced with the incorrect node ID.
             *    - "deleted edge <id1>,<id2>": If the edge was successfully deleted. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
             *    - "edge <id1>,<id2> not exists": If the edge with the provided node IDs does not exist in the graph. The <id1> and <id2> placeholders are replaced with the non-existent edge's node IDs.
             *    - "modified edge <id1>,<id2>": If the edge value was successfully modified. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
             *    - "added edge <id1>,<id2>": If a new edge was successfully added with the specified value. The <id1> and <id2> placeholders are replaced with the IDs of the connected nodes.
             *    - "NOT DONE: both connected nodes must exist in the graph": If either of the nodes specified in the edge do not exist in the graph.
             */
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
                                sgv.graf.addEdge(id1, id2).setValue(val);
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

            let val = parseFloat(split1[1].replace(/,/g, '.'));
            // if NaN -> delete

            let split2 = split1[0].split('+');

            if (split2.length === 1) { // set node
                return setN(split2, val);
            } else if (split2.length === 2) { //set edge
                return setE(split2, val);
            }

            return "bad arguments";
        }

        /**
         * Calls the `displayValues` function on the current graph and returns a message indicating the displayed value.
         * 
         * @param {string} valId - The identifier of the value to display. This is passed as an argument to the `displayValues` function of the current graph.
         * 
         * @returns {string} A message indicating the displayed value. If `displayValues` returns a value, the message is "displayed value: " followed by the returned value.
         */
        function display(valId) {
            return "displayed value: " + sgv.graf.displayValues(valId);
        }
        
        /**
         * Gets or sets the display limits of the current graph. The limits are the thresholds at which the display colors change.
         * 
         * @param {Array} cmds - An array of strings that represents the command and its arguments. 
         *                       - The first element should be the string "limits".
         *                       - The second element should be "set" if you want to set the limits, in which case the array should also contain the new min and max values as the third and fourth elements, respectively.
         * 
         * @returns {string} A string message indicating the result of the operation. This can be one of the following:
         *    - "no graph defined": If the current graph is null.
         *    - "Current display limits [red, green] are set to [<min>,<max>]": If no command other than "limits" is provided. The <min> and <max> placeholders are replaced with the current minimum and maximum display limits, respectively.
         *    - "too few arguments\nUse: limits set <min> <max>": If the "set" command is used but the new min and max values are not provided.
         *    - "Bad arguments: <min> and <max> should be numbers.": If the provided min or max value is not a number.
         *    - "Bad arguments: <min> cannot be greater than zero, <max> cannot be less than zero and both values cannot be zero at the same time.": If the provided min value is greater than zero, the max value is less than zero, or both values are zero.
         *    - "Display limits [red, green] are set to [<min>,<max>]": If the limits were successfully set. The <min> and <max> placeholders are replaced with the new minimum and maximum display limits, respectively.
         *    - "bad arguments": If an unrecognized command is used.
         */        
        function limits(cmds) {
            if (sgv.graf === null) {
                return "no graph defined";
            }

            //let cmds = polecenie.split(" ");
            
            let response = "";
            
            if (cmds.length===1) {
                response = "Current display limits [red, green] are set to [" + sgv.graf.redLimit+", "+sgv.graf.greenLimit+"]\n";
                let minmax = sgv.graf.getMinMaxNodeVal();
                response+= "\nnode values range in current scope is: [" + minmax.min + ", " + minmax.max +"] "+minmax.com;
                minmax = sgv.graf.getMinMaxEdgeVal();
                response+= "\nedge weights range in current scope is: [" + minmax.min + ", " + minmax.max +"] "+minmax.com;
                return response;
            }
            
            
            switch (cmds[1]) {
                case "set":
                    if (cmds.length<4){
                        return "too few arguments\nUse: limits set <min> <max>";
                    }
                    
                    let min = parseFloat(cmds[2].replace(/,/g, '.'));
                    let max = parseFloat(cmds[3].replace(/,/g, '.'));
                    
                    if (isNaN(min)||isNaN(max)){
                        return "Bad arguments: <min> and <max> should be numbers.";
                    }

                    if ((min>0)||(max<0)||(min===max)){
                        return "Bad arguments: <min> cannot be greater than zero, <max> cannot be less than zero and both values cannot be zero at the same time.";
                    }

                    sgv.graf.redLimit = min;
                    sgv.graf.greenLimit = max;

                    response = "Display limits [red, green] are set to [" + sgv.graf.redLimit+", "+sgv.graf.greenLimit+"]";
                    
                    break;
                default:
                    return "bad arguments";
            }
            
            sgv.graf.displayValues(sgv.graf.currentScope);
            return response;
        }
        
        /**
         * Provides help information for the specified command.
         * 
         * @param {string} command - The name of the command to provide help for. It should be one of the following: "set", "create", "clear", "display", "displaymode".
         * 
         * @returns {string} A string message containing help information for the specified command. If the command is not recognized, the message will contain help information for all commands.
         */        
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
            case "limits":
                result = limits(command);
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
            case "scope":
                result = scope(command[1], command[2]);
                break;
            case "display":
                result = display(command[1]);
                break;
            case "displaymode":
                if (sgv.graf===null) {
                    result = "graph is not defined";
                }
                else if (Graph.displayModes.includes(command[1])) {
                    Graph.currentDisplayMode = command[1];
                    sgv.graf.setDisplayMode();
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
    
    /**
     * 
     * @public
     * @return {none}
     */
    switchConsole() {
        if (this.ui.style.display !== "block") {
            this.ui.style.display = "block";
        } else {
            this.ui.style.display = "none";
        }
    }

    /**
     * Shows the console.
     * @public
     * @return {none}
     */
    showConsole() {
        this.ui.style.display = "block";
    }

    /**
     * Hides the console.
     * @public
     * @return {none}
     */
    hideConsole() {
        this.ui.style.display = "none";
    }
    
}

/**
 * Represents the static instance of DlgConsole in the sgv namespace.
 * @type {DlgConsole}
 * @memberof sgv
 * @static
 */
sgv.dlgConsole = new DlgConsole();
