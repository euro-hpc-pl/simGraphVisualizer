"use strict";
/* global BABYLON, displayMode, sgv */

class Chimera extends Graph {
    constructor() {
        super();

        this.type = 'chimera';

        //this.setSize(4,4,4,4);
    }
    
    static createNewGraph(size) {
        var g = new Chimera();
        
        g.cols = size.cols;
        g.rows = size.rows;
        g.KL =   size.KL;
        g.KR =   size.KR;
        
        g.nbModules = g.cols * g.rows;
        g.modSize = g.KL + g.KR;

        g.size = g.nbModules * g.modSize;

        g.createNew();

        return g;
    }

    
    setSize(c, r, kl, kr) {
        this.cols = c;
        this.rows = r;
        this.KL = kl;
        this.KR = kr;
        
        this.nbModules = this.cols * this.rows;
        this.modSize = this.KL + this.KR;

        this.size = this.nbModules * this.modSize;
    }
    
    maxNodeId() {
        return this.cols * this.rows * (this.KL + this.KR);
    }

    createNew() {
        //const start = performance.now();
        for (let m = 0; m<this.nbModules; m++) {
            this.createModule( m );
        }
        //const end = performance.now();
        //console.log(end - start);
        
        for (let x=0; x<this.nbModules; x+=this.rows)
            for (let y=1; y<this.rows; y++) {
                this.connectRowModules( x+(y-1), x+y );
            }    
    
        for (let y=0; y<this.rows; y++)
            for (let x=this.rows; x<this.nbModules; x+=this.rows) {
                this.connectColModules( (x-this.rows)+y, x+y );
            }    
    
        super.showLabels(true);
    }
    

    connectRowModules(module1id, module2id) {
        for (let i=(this.KL+1); i<=this.modSize; i++) {
            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
        }
    }

    connectColModules(module1id, module2id) {
        for (let i=1; i<=this.KL; i++) {
            this.addEdge(this.modSize*module1id + i, this.modSize*module2id + i, 0.0);
        }
    }


    createModule(moduleId) {
        var offset = this.modSize*moduleId;
        
        // MODULE NODES
        for (let i=1; i<=this.modSize; i++) {
            this.addNode( offset+i, this.calcPosition(offset+i), 0.0 );
        }

        // INTERNAL MODULE EDGES
        for (let x=1; x<=this.KL; x++)
            for (let y=(this.KL+1); y<=this.modSize; y++) {
                this.addEdge( offset + x, offset + y, 0.0);        
            }
    }
    
    mX = {
      '-8': 375,
      '-7': 325,
      '-6': 275,
      '-5': 225,
      '-4': 175,
      '-3': 125,
      '-2': 75,
      '-1': 25,
      '0': -25,
      '1': -75,
      '2': -125,
      '3': -175,
      '4': -225,
      '5': -275,
      '6': -325,
      '7': -375
    };

    mmX(i) {
        return -25 - 50 * i;
    }

    mY = {
      '-8': 75,
      '-7': 65,
      '-6': 55,
      '-5': 45,
      '-4': 35,
      '-3': 25,
      '-2': 15,
      '-1':  5,
      '0':  -5,
      '1': -15,
      '2': -25,
      '3': -35,
      '4': -45,
      '5': -55,
      '6': -65,
      '7': -75
    };
    
    mmY(i) {
        return -5 - 10 * i;
    }
    
    mZ = {
      '-8': -375,
      '-7': -325,
      '-6': -275,
      '-5': -225,
      '-4': -175,
      '-3': -125,
      '-2': -75,
      '-1': -25,
      '0':   25,
      '1':   75,
      '2':  125,
      '3':  175,
      '4':  225,
      '5':  275,
      '6':  325,
      '7':  375
    };

    mmZ(i) {
        return 25 + 50 * i;
    }



    getNodeOffset(nodeId) {
        //console.log(nodeId);
        
        let nodeOffset = {
            'classic': [    new BABYLON.Vector3(  15, -3, -10),
                            new BABYLON.Vector3(   5, -1, -10),
                            new BABYLON.Vector3(  -5,  1, -10),
                            new BABYLON.Vector3( -15,  3, -10),
                            new BABYLON.Vector3(  15,  3,  10),
                            new BABYLON.Vector3(   5,  1,  10),
                            new BABYLON.Vector3(  -5, -1,  10),
                            new BABYLON.Vector3( -15, -3,  10)],

            'diamond': [    new BABYLON.Vector3(   0, -3,   9),
                            new BABYLON.Vector3(   0, -1,   3),
                            new BABYLON.Vector3(   0,  1,  -3),
                            new BABYLON.Vector3(   0,  3,  -9),
                            new BABYLON.Vector3(   9,  3,   0),
                            new BABYLON.Vector3(   3,  1,   0),
                            new BABYLON.Vector3(  -3, -1,   0),
                            new BABYLON.Vector3(  -9, -3,   0)],

            'triangle': [   new BABYLON.Vector3(  -15, -3,   9),
                            new BABYLON.Vector3(  -15, -1,   3),
                            new BABYLON.Vector3(  -15,  1,  -3),
                            new BABYLON.Vector3(  -15,  3,  -9),
                            new BABYLON.Vector3(   9,  3, 15),
                            new BABYLON.Vector3(   3,  1, 15),
                            new BABYLON.Vector3(  -3, -1, 15),
                            new BABYLON.Vector3(  -9, -3, 15)]
        };
        
        let idx = nodeId;
        if (idx<this.KL) {
            return nodeOffset[sgv.displayMode][idx];
        }
        else {
            idx -= this.KL;
            idx += 4;
            return nodeOffset[sgv.displayMode][idx];
        }
    }
    
    
    calcPosition(nodeId) {
        var moduleId = Math.floor( (nodeId-1) / this.modSize );
        var nodeIdInModule = Math.floor( (nodeId-1) % this.modSize );

        var moduleRow = Math.floor( moduleId / this.rows ) - (this.rows/2);
        var moduleCol = Math.floor( moduleId % this.cols ) - (this.cols/2);
        
        var newPos = new BABYLON.Vector3( this.mX[moduleRow], this.mY[moduleRow], this.mZ[moduleCol] );
        //var newPos = new BABYLON.Vector3( this.mmX(moduleRow), this.mmY(moduleRow), this.mmZ(moduleCol) );
        
        newPos.addInPlace( this.getNodeOffset(nodeIdInModule) );

        return newPos;
    };
    
    
   
    fromDef = function(def) {
        for (let i = 0; i<def.length; i++) {
            if (def[i].n1 === def[i].n2) {
                let nodeId = def[i].n1;

                this.addNode( nodeId, this.calcPosition(nodeId), def[i].val );
            }
            else {
                let n1 = def[i].n1;
                let n2 = def[i].n2;
                this.addEdge( n1, n2, def[i].val );
                //let strId = "" + n1 + "," + n2;
                //this.edges[strId].setValue(  );
            }
        }
        //console.log(this.nodes);
    };
    
    
    
    
    
}

