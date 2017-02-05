import buckets from 'buckets-js';
class RunningEnvironment{
    constructor() {
        this.block = [];
        this.visited = [];
        this.traces = new Map();
    }

    initBlock(blockMatrix) {
        var len = blockMatrix.length;
        var width = blockMatrix[0].length;

        var i, j;
        for (i = 0; i < len; i++) {
            this.block[i] = [];
            this.visited[i] = [];
            for (j = 0; j < width; j++) {
                this.block[i][j] = blockMatrix[i][j];
                if (blockMatrix[i][j] == 1) {
                    this.visited[i][j] = -1;
                } else {
                    this.visited[i][j] = 0;
                }
            }
        }
    }

    addAgent(ID, initialPosition) {
        var positions = buckets.LinkedList();
        positions.add(initialPosition, 0);
        this.traces.set(ID, positions);
    }
}


