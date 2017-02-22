import buckets from 'buckets-js';
import PF from 'pathfinding';

class RunningEnvironment{
    constructor() {
        this.block = [];
        this.visited = [];
        this.traces = new Map();
        this.regions = new Object();
        this.targetLists = new Object();
        this.agentMapRegion = new Object();
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
        this.bindAgentWithRegion(ID, initialPosition);
        let positions = [];
        positions.push(initialPosition);
        this.traces.set(ID, positions);
        this.visited[initialPosition['row']][initialPosition['column']]++;
        //remove from target lists
        this.removeFromTargetList(ID, initialPosition);
    }

    //remove a position that the agent whose ID is agentID 
    //visited from the region's target list
    removeFromTargetList(agentID, position) {
        let regionID = this.agentMapRegion.agentID;
        this.targetLists.regionID.fillter((coordinate) => 
            coordinate.row !== position.row || coordinate.column !== position.column
        );
    }

    //bind a agent with the region where the agent locate in
    bindAgentWithRegion(agentID, initialPosition) {
        let regionID;
        this.regions.forEach((value, key) => {
            let i = 0;
            for (i = 0; i < value.length; i++) {
                if (value[i].row === initialPosition.row &&
                 value[i].column === initialPosition.column) {
                    regionID = key;
                 }
            }
        });
        this.agentMapRegion.agentID = regionID;
    }

    //add a region, this function should be invoked before addAgent
    addRegions(regions) {
        regions.forEach((value, key) => {
            this.regions.key = value;
            this.targetLists.key = value;
        });
    }


    getATargetFromTargetList(agentID, currentPosistion) {
        let regionID = this.agentMapRegion.agentID;
        let maxDistance = 0;
        let target;
        this.targetLists.regionID.forEach(function(position) {
            if (this.manhattanDistance(currentPosition, position) > maxDistance) {
                target = position;
            }
        });
        return target;
    }

    manhattanDistance(position1, position2) {
        return Math.abs(position1.row - position2.row) + 
               Math.abs(position1.column - position2.column);
    }

    markVisited(path) {
        let i;
        for (i = 0; i < path.length; i++) {
            this.visited[path[i].row][path[i].column]++;
        }
    }

    move() {
        while (!this.isComplete()) {
            for (let agentID in this.traces) {
                let regionsID = this.agentMapRegion.agentID;
                let trace = this.traces.agentID;
                let currentPosistion = trace[trace.length - 1];
                let target = this.getATargetFromTargetList(agentID, currentPosistion);
                if (!target) {
                    continue;
                }
                let grid = new PF.Grid(this.block); 
                let finder = new PF.AStarFinder();
                let path = finder.findPath(currentPosistion.row, currentPosistion.column,
                                             target.row, target.column, grid);
                //mark those point to be visited
                this.markVisited(path);

                //remove every visited point from the target list
                let i;
                for (i = 0; i < path.length; i++) {
                    this.removeFromTargetList(agentID, path[i]);
                }

            }
        }    

    }

    //find unvisited neighbour in the order of right->up->left->down
    findANeighbour(row, column) {
        const len = this.visited.length;
        const width = this.visited[0].length;

        if (row >= len || row < 0 || column < 0 || column >= width) return null;

        let neighbour = {};

        if (column + 1 < width && this.visited[row][column + 1] === 0) {
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


