/* global sgv, UI, URL, Chimera, Pegasus, ParserGEXF, ParserTXT */
var FileIO = {};

FileIO.onLoadButton = () => {
    let btnLoad1 = UI.tag('input',{
        'type':'file',
        'id':'inputfile',
        'display':'none'
    });
    btnLoad1.addEventListener('change', (e)=>{
        if (typeof btnLoad1.files[0]!=='undefined') {
            showSplashAndRun(()=>{
                FileIO.loadGraph(btnLoad1.files[0]);
                //btnLoad1.value = ""; //if I need to read the same file again
            });
        }
    });

    btnLoad1.click();
};

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

FileIO.download = (text, name, type) => {
    let a = document.createElement("a");
    let file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
};

FileIO.alternateSave = (name, ext) => {
    if (ext === '.txt') {
        let string = ParserTXT.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'text/plain');
    } else if (ext === '.gexf') {
        let string = ParserGEXF.exportGraph(sgv.graf);
        FileIO.download(string, name+ext, 'application/xml');
    }
};

sgv.stringToScope = (data,newScope) => {
    let r = sgv.graf.loadScopeValues(newScope,data);
            
    if (r.n) {
        sgv.dlgCPL.addScope(newScope);
    }
    sgv.dlgCPL.selScope(newScope);
};


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
        
FileIO.loadGraph2 = function(name,data) {
    if (name.endsWith("txt")) {
        if (sgv.graf!==null) {
            sgv.removeGraph();
        }
        ParserTXT.importGraph(data);
    } else if(name.endsWith("gexf")) {
        if (sgv.graf!==null) {
            sgv.removeGraph();
        }
        if (ParserGEXF.importGraph(data)){
            sgv.setModeDescription();
        }
    };
};
