/* global sgv, UI, URL, Chimera, Pegasus, ParserGEXF, ParserTXT, Graph, Dispatcher */

/**
 * FileIO namespace for file input/output operations.
 * @namespace
 */
var FileIO = {};

/**
 * Event handler for the load button.
 */
FileIO.onLoadButton = () => {
    let btnLoad1 = UI.tag('input',{
        'type':'file',
        'id':'inputfile',
        'display':'none'
    });
    // Add event listener to handle file selection
    btnLoad1.addEventListener('change', (e)=>{
        if (typeof btnLoad1.files[0]!=='undefined') {
            showSplashAndRun(()=>{
                FileIO.loadGraph(btnLoad1.files[0]);
                //btnLoad1.value = ""; //if I need to read the same file again
            });
        }
    });

    // Simulate a click event to trigger file selection dialog
    btnLoad1.click();
};

/**
 * Event handler for the save button.
 * @returns {Promise} A promise that resolves or rejects based on the save operation.
 */
FileIO.onSaveButton = ()=>{
    return new Promise((resolve,reject)=>{
        if (typeof window.showSaveFilePicker === 'function') {
            const options = {
                suggestedName: 'name.txt',
                excludeAcceptAllOption: true,
                types: [
                    {
                        description: 'Text file',
                        accept: {'text/plain': ['.txt']}
                    }, {
                        description: 'GEXF files',
                        accept: {'application/xml': ['.gexf']}
                    }]
            };

            window.showSaveFilePicker(options)
                .then((handle)=>{
                    let blob;

                    if (handle.name.endsWith('.txt')) {
                        blob = new Blob([ParserTXT.exportGraph(sgv.graf)]);    
                    } else if (handle.name.endsWith('.gexf')) {
                        blob = new Blob([ParserGEXF.exportGraph(sgv.graf)]);
                    } else {
                        reject('point 1');
                    }

                    handle.createWritable()
                        .then( (writableStream)=> {
                            writableStream.write(blob)
                            .then( () => {
                                writableStream.close();                        
                                resolve('point 3 (OK)'); });
                        }).catch( ()=>{
                            reject('point 5'); });
                }).catch(()=>{
                    reject('point 2');
                });
        } else {
            sgv.dlgAlternateFileSave.show();
            resolve('point 4 (OK)');
        }
    });
    
}; 

/**
 * Downloads a file.
 * @param {string} text - The text content of the file.
 * @param {string} name - The name of the file.
 * @param {string} type - The MIME type of the file.
 */
FileIO.download = (text, name, type) => {
    let a = document.createElement("a");
    let fileAsBlob = new Blob([text], {type: type});
    
    a.download = name;
    a.innerHTML = "Download graph file";

    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        a.href = window.webkitURL.createObjectURL(fileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        a.href = window.URL.createObjectURL(fileAsBlob);
        a.onclick = function (event) {
            document.body.removeChild(event.target);
        };
        a.style.display = "none";
        document.body.appendChild(a);
    }
    
    a.click();
};

/**
 * Saves the graph with an alternate file name and extension.
 * @param {string} name - The name of the file.
 * @param {string} ext - The extension of the file.
 */
FileIO.alternateSave = (name, ext) => {
    if (ext === '.txt') {
        let string = ParserTXT.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'text/plain');
    } else if (ext === '.gexf') {
        let string = ParserGEXF.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'application/xml');
    }
};

/**
 * Converts a string representation of graph data to the specified scope.
 * @param {string} data - The string representation of the graph data.
 * @param {string} newScope - The new scope for the graph.
 */
sgv.stringToScope = (data,newScope) => {
    let r = sgv.graf.loadScopeValues(newScope,data);
            
    if (r.n) {
        sgv.dlgCPL.addScope(newScope);
    }
    sgv.dlgCPL.selScope(newScope);
};


/**
 * Loads a graph from a selected file.
 * @param {File} selectedFile - The selected file.
 */
FileIO.loadGraph = function(selectedFile) {
    const name = selectedFile.name;
    const reader = new FileReader();
    if (selectedFile) {
        reader.addEventListener('error', () => {
            console.error(`Error occurred reading file: ${selectedFile.name}`);
        });

        reader.addEventListener('load', () => {
            FileIO.loadGraph2(name, reader.result);
        });

        if ( name.endsWith("txt") || name.endsWith("gexf") ) {
            reader.readAsText(selectedFile); 
        } else {
            console.error(`Incorrect file extension...`);
        }
    }                    
};
        
/**
 * Loads a graph with the specified name and data.
 * @param {string} name - The name of the graph.
 * @param {string} data - The data of the graph.
 */
FileIO.loadGraph2 = function(name,data) {
    if (name.endsWith("txt")) {
        Graph.remove();
        ParserTXT.importGraph(data);
    } else if(name.endsWith("gexf")) {
        Graph.remove();
        if (ParserGEXF.importGraph(data)){
            Dispatcher.graphCreated();
        }
    };
};
