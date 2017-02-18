import buckets from 'buckets-js';
class RunningEnvironment{
    constructor() {
        this.block = [];
        this.visited = [];
        this.traces = new Map();
    }

    //init the environment with blockMatrix
    initBlock(blockMatrix) {
        const len = blockMatrix.length;
        const width = blockMatrix[0].length;

        let i, j;
        for (i = 0; i < len; i++) {
            this.block[i] = [];
            this.visited[i] = [];
            for (j = 0; j < width; j++) {
                this.block[i][j] = blockMatrix[i][j];
                if (blockMatrix[i][j] === -1) {
                    this.visited[i][j] = -1;
                } else {
                    this.visited[i][j] = 0;
                }
            }
        }
    }

    //add an agent in a region
    addAgent(ID, initialPosition) {
        let positions = [];
        positions.push(initialPosition);
        this.traces.set(ID, positions);
        this.visited[initialPosition['row']][initialPosition['column']]++;
    }

    move() {
        let stacks = new Map();
        // create a stack for each agent
        let Iter = this.traces.keys();

        this.traces.forEach((value, key) => {
            let stack = [];
            stacks.set(key, stack);
        });
        
        this.traces.forEach((value, key) => {
            var trace = this.traces.get(key);
            var stack = stacks.get(key);
            var lastPosition = trace[trace.length - 1];
            stack.push(lastPosition);
        });

        while (this.isComplete() != 1) {
            this.traces.forEach((value, key) => {
                var trace = this.traces.get(key);
                var stack = stacks.get(key);
                var lastPosition = trace[trace.length - 1];
                // stack.push(lastPosition);
                var neighbour = this.findANeighbour(lastPosition.row, lastPosition.column);

                if (!neighbour) {
                    if (stack.length == 0) continue;
                    stack.pop();
                    if (stack.length == 0) continue;
                    var nextPosition = stack[stack.length - 1];
                    this.visited[nextPosition.row][nextPosition.column]++;
                    trace.push(nextPosition);
                } else {
                    this.visited[neighbour.row][neighbour.column]++;
                    stack.push(neighbour);
                    trace.push(neighbour);
                }
            });
        }

    }

    //find unvisited neighbour in the order of right->up->left->down
    findANeighbour(row, column) {
        const len = this.visited.length;
        const width = this.visited[0].length;

        if (row >= len || row < 0 || column < 0 || column >= width) return null;

        let neighbour = {};

        if (column + 1 < len && this.visited[row][column + 1] === 0) {
            neighbour['row'] = row;
            neighbour['column'] = column + 1;
            return neighbour; 
        }

        if (row - 1 >= 0 && this.visited[row - 1][column] === 0) {
            neighbour['row'] = row - 1;
            neighbour['column'] = column;
            return neighbour;
        }

        if (column - 1 >= 0 && this.visited[row][column - 1] === 0) {
            neighbour['row'] = row;
            neighbour['column'] = column - 1;
            return neighbour;
        }

        if (row + 1 < len && this.visited[row + 1][column] === 0) {
            neighbour['row'] = row + 1;
            neighbour['column'] = column;
            return neighbour;
        }
    }

    // if the every open space is visited, return 1, otherwise return 0;
    isComplete() {
        let r = 1;

        const len = this.visited.length;
        const width = this.visited[0].length;

        let i = 0;
        let j = 0;
        
        for (i = 0; i < len; i++) {
            for (j = 0; j < width; j++) {
                if (this.visited[i][j] === 0) {
                    r = 0;
                    return r;
                }
            }
        }
        return r;
    }
}

// const algorithm = RunningEnvironment;
export {RunningEnvironment};


