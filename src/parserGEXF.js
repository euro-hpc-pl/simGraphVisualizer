
/* global sgv, Chimera, Pegasus, Graph */

/**
 * @fileoverview This script imports and exports graphs in GEXF (Graph Exchange XML Format) format.
 * 
 * @module ParserGEXF
 */

"use strict";

/** @type {Object} Module exporting GEXF parsing functionality */
var ParserGEXF = {};

/**
 * Function to import graph data from GEXF format.
 * 
 * @function importGraph
 * @memberof ParserGEXF
 * @param {string} string - Input graph data in GEXF format
 * @returns {boolean} - Returns true upon successful completion
 */
ParserGEXF.importGraph = (string) => {
    // Initialize data structures
    
    //var graphType = "unknown";
    //var graphSize = { cols:0, rows:0, lays:0, KL:0, KR:0 };
    var graphDescr = new GraphDescr();
    var nodeAttrs = {};
    var edgeAttrs = {};
    var struct = new TempGraphStructure();
    
    /**
     * Parses node elements from the GEXF XML data.
     *
     * @param {Element} parentNode - Parent XML node to parse nodes from
     */
    function parseNodes(parentNode) {
        let nodes = parentNode.getElementsByTagName("nodes");
        let node = nodes[0].getElementsByTagName("node");
        
        for ( let i =0; i<node.length; i++){
            let def = {};

            let id = node[i].getAttribute("id");
            
            def.n1 = def.n2 = parseInt(id);
            def.values = {};

            let label = node[i].getAttribute("label");
            
            let attvals = node[i].getElementsByTagName("attvalues");
            
            if (attvals.length>0) {
                let vals = attvals[0].getElementsByTagName("attvalue");
            
                for ( let j =0; j<vals.length; j++){
                    let value = vals[j].getAttribute("value");
                    let k = vals[j].getAttribute("for");
                    let title = nodeAttrs[k];
                    def.values[title] = parseFloat(value);
                }    
            }
            
            if (label===null)
                struct.addNode2(def.n1, def.values);
            else
                struct.addNode2(def.n1, def.values, label);
        }
    };
    
    /**
     * Parses edge elements from the GEXF XML data.
     *
     * @param {Element} parentNode - Parent XML node to parse edges from
     */
    function parseEdges(parentNode) {
        let nodes = parentNode.getElementsByTagName("edges");
        let node = nodes[0].getElementsByTagName("edge");
        
        for ( let i =0; i<node.length; i++){
            let def = {};

            let source = node[i].getAttribute("source");
            let target = node[i].getAttribute("target");
            
            def.n1 = parseInt(source);
            def.n2 = parseInt(target);
            def.values = {};
            
            let attvals = node[i].getElementsByTagName("attvalues");
            
            if (attvals.length>0) {
                let vals = attvals[0].getElementsByTagName("attvalue");
            
                for ( let j =0; j<vals.length; j++){
                    let value = vals[j].getAttribute("value");
                    let k = vals[j].getAttribute("for");
                    let title = edgeAttrs[k];
                    def.values[title] = parseFloat(value);
                }    
            }
            
            struct.addEdge2(def.n1, def.n2, def.values);
        }
    };

    /**
     * Parses node attributes from the GEXF XML data.
     *
     * @param {Element} attributeNode - XML node to parse attributes from
     * @returns {Object} - Returns an object containing the parsed attribute data
     */
    function parseNodeAttribute(attributeNode) {
        let id = attributeNode.getAttribute("id");
        let title = attributeNode.getAttribute("title");

        if (title.startsWith('default')){
            let list = title.split(";");

            title = list[0];
            let type = list[1];
            let size = list[2];

            return {id,title,type,size};
        }

        return {id,title};
    };
    

    /**
     * Parses edge attributes from the GEXF XML data.
     *
     * @param {Element} attributeNode - XML node to parse attributes from
     * @returns {Object} - Returns an object containing the parsed attribute data
     */
    function parseEdgeAttribute(attributeNode) {
        let id = attributeNode.getAttribute("id");
        let title = attributeNode.getAttribute("title");
        return {id,title};
    };


    /**
     * Parses attributes from the GEXF XML data.
     *
     * @param {Element} parentNode - Parent XML node to parse attributes from
     */
    function parseAttributes(parentNode){
        let attrs = parentNode.getElementsByTagName("attributes");

        for ( let i =0; i<attrs.length; i++){
            let attrsClass = attrs[i].getAttribute("class");

            let attr = attrs[i].getElementsByTagName("attribute");

            for ( let j =0; j<attr.length; j++){
                if (attrsClass === "node" ) {
                    let result = parseNodeAttribute(attr[j]);

                    nodeAttrs[result.id] = result.title;


                    if ('type' in result){ //default with graph type and size
                        graphDescr.setType(result.type);
                    }

                    if ('size' in result){
                        let ss = result.size.split(",");
                        //if (ss.lenght>3){
                            graphDescr.setSize(
                                parseInt(ss[0]),
                                parseInt(ss[1]),
                                parseInt(ss[2]),
                                parseInt(ss[3]),
                                parseInt(ss[4]));
                        //}
                    }  
                } else if (attrsClass === "edge" ) {
                    let result = parseEdgeAttribute(attr[j]);
                    edgeAttrs[result.id] = result.title;
                }
            }
        }
    };
    
    
    // Parse the input string as XML
    if (window.DOMParser) {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(string, "text/xml");
    }
    else { // Internet Explorer 
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(string);
    }
    
    //console.log(xmlDoc);
    
    // Parse the XML data
    parseAttributes(xmlDoc);
    parseNodes(xmlDoc);
    parseEdges(xmlDoc);
   
    // Create graph and return
    Graph.create(graphDescr, struct);
    
    for (const i in nodeAttrs) {
        if (!sgv.graf.scopeOfValues.includes(nodeAttrs[i]))
            sgv.graf.scopeOfValues.push(nodeAttrs[i]);
    }

    return true;
};

/**
 * Exports a graph to GEXF format.
 * 
 * @function exportGraph
 * @memberof ParserGEXF
 * @param {Graph} graph - The graph object to export
 * @returns {?string} - The exported graph in GEXF format, or null if the graph is undefined or null
 */
ParserGEXF.exportGraph = function(graph) {
    if ((typeof graph==='undefined')||(graph === null)) return null;
    
    /**
     * Converts a graph node to GEXF format.
     *
     * @param {Node} node - The node to export
     * @returns {string} - The node exported to GEXF format
     */
    function exportNode(node) {
        let xml = '      <node id="' + node.id;
        if (node.isLabelVisible()) {
            xml += '" label="' + node.getLabel();
        }
        xml += '">\n';
        xml += "        <attvalues>\n";
        for (const key in node.values) {
            xml += "          <attvalue for=\""+node.parentGraph.getScopeIndex(key)+"\" value=\""+node.values[key]+"\"/>\n";
        }
        xml += "        </attvalues>\n";
        xml += "      </node>\n";
        return xml;
    };

    /**
     * Converts a graph edge to GEXF format.
     *
     * @param {Edge} edge - The edge to export
     * @param {number} tmpId - The temporary ID for the edge
     * @returns {string} - The edge exported to GEXF format
     */
    function exportEdge(edge, tmpId) {
        let xml = "      <edge id=\""+tmpId+"\" source=\""+edge.begin+"\" target=\""+edge.end+"\">\n";
        xml += "        <attvalues>\n";
        for (const key in edge.values) {
            xml += "          <attvalue for=\""+edge.parentGraph.getScopeIndex(key)+"\" value=\""+edge.values[key]+"\"/>\n";
        }
        xml += "        </attvalues>\n";
        xml += "      </edge>\n";
        return xml;
    };

    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    //xml += "<gexf xmlns=\"http://www.gexf.net/1.2draft\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema−instance\" xsi:schemaLocation=\"http://www.gexf.net/1.2draft http://www.gexf.net/1.2draft/gexf.xsd\" version=\"1.2\">\n";
    xml += "<gexf xmlns=\"http://gexf.net/1.2\" version=\"1.2\">\n";
    xml += "  <meta>\n";// lastmodifieddate=\"2009−03−20\">\n";
    xml += "    <creator>IITiS.pl</creator>\n";
    xml += "    <description>SimGraphVisualizer GEXF export</description>\n";
    xml += "  </meta>\n";


    xml += "  <graph defaultedgetype=\"undirected\">\n";

    xml += "    <attributes class=\"node\">\n";
    for (const key in graph.scopeOfValues) {
        let val = graph.scopeOfValues[key];
        if (val==='default'){
            val+= ";" + graph.type + ";" + graph.cols + "," + graph.rows + "," + graph.layers + "," + graph.KL + "," + graph.KR;
        }
        xml += "      <attribute id=\""+key+"\" title=\""+val+"\" type=\"float\"/>\n";
    }
    xml += "    </attributes>\n";

    xml += "    <nodes>\n";
    for (const key in graph.nodes) {
        xml += exportNode(graph.nodes[key]);
    }
    xml += "    </nodes>\n";

    xml += "    <attributes class=\"edge\">\n";
    for (const key in graph.scopeOfValues) {
        let val = graph.scopeOfValues[key];
//            if (val==='default'){
//                val+= ";" + graph.type + ";" + graph.cols + "," + graph.rows + "," + graph.KL + "," + graph.KR;
//            }
        xml += "      <attribute id=\""+key+"\" title=\""+val+"\" type=\"float\"/>\n";
    }
    xml += "    </attributes>\n";


    xml += "    <edges>\n";
    let tmpId = 0;
    for (const key in graph.edges) {
        xml += exportEdge(graph.edges[key], ++tmpId);
    }
    xml += "    </edges>\n";
    xml += "  </graph>\n";
    xml += "</gexf>\n";

    return xml;
};
