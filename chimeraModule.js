class ChimeraModule {
    constructor( graf, moduleId, firstNode ) {
        this.parentGraf = graf;
        this.id = moduleId;
        //this.firstNode = firstNode;
        
        this.row = 0;
        this.col = 0;
    }
    
    create(moduleId, xOffset, yOffset, zOffset) {
        // MODULE NODES
        this.addNode(moduleId, xOffset + 15, yOffset - 3, zOffset - 10);
        this.addNode(moduleId + 1, xOffset + 5, yOffset - 1, zOffset - 10);
        this.addNode(moduleId + 2, xOffset - 5, yOffset + 1, zOffset - 10);
        this.addNode(moduleId + 3, xOffset - 15, yOffset + 3, zOffset - 10);
        this.addNode(moduleId + 4, xOffset + 15, yOffset + 3, zOffset + 10);
        this.addNode(moduleId + 5, xOffset + 5, yOffset + 1, zOffset + 10);
        this.addNode(moduleId + 6, xOffset - 5, yOffset - 1, zOffset + 10);
        this.addNode(moduleId + 7, xOffset - 15, yOffset - 3, zOffset + 10);

        // INTERNAL MODULE EDGES
        this.addEdge(2 * moduleId + 0, moduleId, moduleId + 4);
        this.addEdge(2 * moduleId + 1, moduleId, moduleId + 5);
        this.addEdge(2 * moduleId + 2, moduleId, moduleId + 6);
        this.addEdge(2 * moduleId + 3, moduleId, moduleId + 7);

        this.addEdge(2 * moduleId + 4, moduleId + 1, moduleId + 4);
        this.addEdge(2 * moduleId + 5, moduleId + 1, moduleId + 5);
        this.addEdge(2 * moduleId + 6, moduleId + 1, moduleId + 6);
        this.addEdge(2 * moduleId + 7, moduleId + 1, moduleId + 7);

        this.addEdge(2 * moduleId + 8, moduleId + 2, moduleId + 4);
        this.addEdge(2 * moduleId + 9, moduleId + 2, moduleId + 5);
        this.addEdge(2 * moduleId + 10, moduleId + 2, moduleId + 6);
        this.addEdge(2 * moduleId + 11, moduleId + 2, moduleId + 7);

        this.addEdge(2 * moduleId + 12, moduleId + 3, moduleId + 4);
        this.addEdge(2 * moduleId + 13, moduleId + 3, moduleId + 5);
        this.addEdge(2 * moduleId + 14, moduleId + 3, moduleId + 6);
        this.addEdge(2 * moduleId + 15, moduleId + 3, moduleId + 7);
    }
    
}