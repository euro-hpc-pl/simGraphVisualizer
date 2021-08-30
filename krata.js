/* global BABYLON */

class Krata extends Graph {
    constructor(n, scene) {
        super(scene);

        this.type = 'krata';

        this.N = n;

        this.createNodes();
        this.createEdges();
    }

    createEdges() {
        var id = 0;
        for (var x = 0; x < this.N; x++)
        {
            for (var y = 0; y < this.N; y++)
            {
                var i = this.N * x + y;

                if (x > 0)
                {
                    var ix = this.N * (x - 1) + y;
                    this.addEdge(ix, i);
                    id++;
                }

                if (y > 0)
                {
                    var iy = this.N * x + (y - 1);
                    this.addEdge(iy, i);
                    id++;
                }
            }
        }
    }

    createNodes() {
        for (var x = 0; x < this.N; x++)
        {
            for (var y = 0; y < this.N; y++)
            {
                var i = this.N * x + y;
                this.addNode(i, (x - (this.N - 1) / 2) * 10, 10, (y - (this.N - 1) / 2) * 10);
            }
        }

    }
}

