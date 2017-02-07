import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Board} from './Board';

const OPEN = 'open',
      OBSTACLE = 'obstacle',
      AGENT = 'agent',
      BlANK  = '';

let agentId = 0;

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      background: Immutable.fromJS(Array(20).fill(Array(20).fill(BlANK))),
      environment: null,
      agents: Immutable.List([]),
      mouseDown: false,
      mouseDownOnEnvir: false,
      environmentSettled: false,
      initial: true,
      regions: Immutable.List([]),
      tipText: ''
    };

    this.envirPosition = {
      startRow: null,
      startColumn: null,
      endRow: null,
      endColumn: null
    };

    this.mouseDownCoor = {};
    this.mouseUpCoor = {};
  }

  handleMouseDownOnBackground(e) {
    if(this.state.initial){
      this.setState({mouseDown: true});
      // this.setState({initial: false});
      this.envirPosition.startRow = e.target.getAttribute('data-row');
      this.envirPosition.startColumn = e.target.getAttribute('data-column');

      this.mouseDownCoor = e.target.getBoundingClientRect();
    }
  }

  handleMouseOverOnBackground(e) {
    // e.target.innerHTML = '1';
    if(this.state.mouseDown){
      this.envirPosition.endRow = e.target.getAttribute('data-row');
      this.envirPosition.endColumn = e.target.getAttribute('data-column');

      this.mouseUpCoor = e.target.getBoundingClientRect();

      let width = Math.abs(this.envirPosition.endColumn - this.envirPosition.startColumn) + 1,
          height = Math.abs(this.envirPosition.endRow - this.envirPosition.startRow) + 1;
      
      this.setState({tipText: `${width} X ${height}`});
      this.setState(
      {
        environment: Immutable.fromJS(Array(height).fill(Array(width).fill(OBSTACLE)))
      }, () => {
        document.getElementById('environment').style.top = this.mouseDownCoor.top;
        document.getElementById('environment').style.left = this.mouseDownCoor.left;
      });
    }
  }

  handleMouseUpOnEnvironment(e) {
    this.setState({mouseDown: false});
    if(this.state.mouseDownOnEnvir){
      this.setState({mouseDownOnEnvir: false});
      this.setState({initial: false});
    }

    if(this.state.tipText) this.setState({tipText: ''});
  }

  handleMouseDownOnEnvironment(e) {
    e.preventDefault();
    this.setState({mouseDownOnEnvir: true});
    let target = e.target;
    
    if(target.classList.contains('agent') || target.classList.contains('agentMore')) {
      target = target.parentElement
    }

    if(target.classList.contains(OPEN)) {
      this.addAgent.call(this, target);
    }
    else {
      this.setState({regions: this.state.regions.push([])}, () => {this.setOpen(target)});
    }
  }

  handleMouseOverOnEnvironment(e) {
    if(this.state.mouseDownOnEnvir) {
      this.setOpen(e.target);
    }
  }

  addAgent(target) {
    let row = target.getAttribute('data-row'),
        column = target.getAttribute('data-column');
    let agents = this.state.agents;
    agents = agents.push({
      id: agentId++,
      row: Number(row),
      column: Number(column)
    });
    this.setState({agents});
  }

  setOpen(target) {
    let row = target.getAttribute('data-row'),
        column = target.getAttribute('data-column');
    let regions = this.state.regions,
        connectedToOtherRegions = false;

    for(let i = 0; i < regions.size - 1 ; i++) {
      let illegal = false;
      
      regions.get(i).forEach((square) => {
        if((row == square.row && column == square.column - 1) || 
           (row == square.row && column == square.column + 1) || 
           (column == square.column && row == square.row - 1) || 
           (column == square.column && row == square.row + 1)) {
          illegal = true;
          return false;
        }
      })
      if(illegal) return;
    }

    let region = regions.last();
    let notConnected = true,
        repeated = false;
    region.forEach((square) => {
      if(row == square.row && column == square.column) {
        repeated = true;
      }
      if((row == square.row && column == square.column - 1) || 
           (row == square.row && column == square.column + 1) || 
           (column == square.column && row == square.row - 1) || 
           (column == square.column && row == square.row + 1)) {
        notConnected = false;
      }
    });
    if(region.length > 0 && (repeated || notConnected)) return;
    
    this.setState({environment: this.state.environment.update(row, column, OPEN)});

    region = JSON.parse(JSON.stringify(region));
    region.push({row: Number(row), column: Number(column)});
    this.setState({regions: regions.set(-1, region)});
  }

  constructRegionSketch(region, index) {
    if(region.length <= 0) return;
    let left = region[0].column, 
        right = region[0].column, 
        up = region[0].row, 
        down = region[0].row;
    
    region.forEach((square) => {
      left = Math.min(square.column, left);
      right = Math.max(square.column, right);
      up = Math.min(square.row, up);
      down = Math.max(square.row, down);
    });

    let width = (right - left + 1) * 10,
        height = (down - up + 1) * 10;
    
    const squares = [];
    let key = 0;
    for(let i = up; i <= down; i++) {
      for(let j = left; j <= right; j++) {
        let isOpen = false;
        region.forEach((square) => {
          if(i == square.row && j == square.column) isOpen = true;
        });

        squares.push(
          <div className={'sketchSquare ' + (isOpen ? 'sketchSquare-obstacle ' : '')} key={key++}></div>
        )
      }
    }

    const deleter = this.state.mouseDown ? null : (
      <div className="deleter">
        <span className="close warp black" onClick={() => {
          let environment = this.state.environment,
              regions = this.state.regions,
              agents = this.state.agents;
          regions.get(index).forEach((square) => {
            environment = environment.update(square.row, square.column, OBSTACLE);
            agents = agents.filter((agent, i) => {
              if(agent.row == square.row && agent.column == square.column) {
                return false;
              }
              return true;
            });
          });
          this.setState({agents})
          this.setState({environment})

          regions = regions.delete(index);
          
          this.setState({regions})
        }}>
        </span>
      </div>
    );
      
    return (
      <div key={index} className="sketchBlock" data-regionID={index}>
        <div style={{width, height}} className="sketch">
          {squares}
        </div>
        {deleter}
        <div className="clearFloat"></div>
      </div>
    );
  }

  runOneStep() {
    let agents = this.state.agents;
    let environment = this.state.environment;
    agents = agents.map((agent, index) => {
      return this.goOneStep(Math.floor(Math.random() * 4), agent, environment);
    });

    this.setState({agents});
  }

  goOneStep(initialDirection, agent, environment) {
    let goOne = [
      () => {
        if(environment.get(agent.row + 1) && environment.get(agent.row + 1).get(agent.column) === OPEN) {
          agent.row++;
          return agent;
        }
        return false;
      },
      () => {
        if(environment.get(agent.row - 1) && environment.get(agent.row - 1).get(agent.column) === OPEN) {
          agent.row--;
          return agent;
        }
      },
      () => {
        if(environment.get(agent.row) && environment.get(agent.row).get(agent.column + 1) === OPEN) {
          agent.column++;
          return agent;
        }
      },
      () => {
        if(environment.get(agent.row) && environment.get(agent.row).get(agent.column - 1) === OPEN) {
          agent.column--;
          return agent;
        }
      }
    ];

    for(let i = initialDirection; i < initialDirection + goOne.length; i++){
      if(goOne[i % goOne.length]()) break;
    }

    return agent;
  }

  render() {
    const background = (
      <Board 
        id="background" 
        board={this.state.background}
        onMouseDown={this.handleMouseDownOnBackground.bind(this)}
        onMouseOver={this.handleMouseOverOnBackground.bind(this)}
      />
    );
    const environment = this.state.environment ? (
      <Board 
        id="environment" 
        board={this.state.environment}
        agents={this.state.agents}
        tipText={this.state.tipText}
        onMouseDown={this.handleMouseDownOnEnvironment.bind(this)}
        onMouseUp={this.handleMouseUpOnEnvironment.bind(this)}
        onMouseOver={this.handleMouseOverOnEnvironment.bind(this)}
      />
    ) : null;

    const leftBar = (
      <div id="leftBar">
        {this.state.regions.map(this.constructRegionSketch.bind(this))}
      </div>
    );

    const rightBar = (
      <div id="rightBar">
        <div id="btn-runOne" onClick={this.runOneStep.bind(this)}>
          RUN 1 STEP
        </div>
      </div>
    );
    
    return (
      <div>
        {leftBar}
        {background}
        {environment}
        {rightBar}
      </div>
    )
  }
}

ReactDOM.render(
  <Game/>,
  document.getElementById('container')
);

// function setPosition(){
//   let background = document.getElementById('background');
//   let top = (window.innerHeight - background.clientHeight) / 2,
//   left = (window.innerWidth - background.clientWidth) / 2;
//   background.style.top = top;
//   background.style.left = left;
// }

//update Immutable.js list of lists
Immutable.List.prototype.update = function (row, column, value){
  if(this.size == 0) return;
  return this.set(row, this.get(row).set(column, value))
}