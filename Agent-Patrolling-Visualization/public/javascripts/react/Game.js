import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Board, initAgentsColor} from './Board';
import {RunningEnvironment} from '../RunningEnvironment'
import randomColor from 'randomcolor';
import Hammer from 'react-hammerjs';
import {graph}  from '../graphview/graph';

const OPEN = 'open',
      OBSTACLE = 'obstacle',
      AGENT = 'agent',
      BlANK  = '';

const agentColors = randomColor({
   count: 20,
   luminosity: 'light'
});

let agentId = 0;
let algorithm;

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
      tipText: '',
      btn_finished_class: 'hidden',
      btn_runOne_class: 'hidden',
      btn_runMuti_class: 'hidden',
      regionBar_class: 'show_regionBar',
      agentBar_class: ''
    };

    this.envirPosition = {
      startRow: null,
      startColumn: null,
      endRow: null,
      endColumn: null
    };

    this.curStep = 0;

    this.mouseDownCoor = {};
    this.mouseUpCoor = {};
  }

  runOneStep() {
    this.curStep++;
    let agents = this.state.agents;

    let isEnd = true;

    algorithm.traces.forEach((trace, id) => {
      if(!trace[this.curStep]) return;
      isEnd = false;

      let curPosition = trace[this.curStep],
          row = curPosition.row,
          column = curPosition.column;
      
      let move = judgeMove(agents.get(id), {row, column});
      document.getElementById('agent-' + id).classList.add(move);

      let hidden = agents.get(id).hidden;
      agents = agents.set(id, {id, row, column, hidden});
    });
    if(isEnd) return;
    setTimeout(() => this.setState({agents}), 350);

    function judgeMove(prev, cur) {
      if (cur.row < prev.row) {
        return 'moveUp';
      } else if (cur.row > prev.row) {
        return 'moveDown';
      } else if (cur.column < prev.column) {
        return 'moveLeft';
      } else {
        return 'moveRight';
      }
    }
    
    graph(this.state.regions.get(0), algorithm.traces, this.curStep);
  }

  runMutiSteps() {
    let total = this.stepsInput.value,
        steps = total;
    while(steps > 0) {
      setTimeout(this.runOneStep.bind(this), (total - steps) * 400);
      steps--;
    }
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
    if (this.state.mouseDown) {
      this.setState({mouseDown: false});
      setTimeout(() => this.setState({btn_finished_class: 'show'}), 1000);
    }
    if (this.state.mouseDownOnEnvir){
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

  // runOneStep() {
  //   let agents = this.state.agents;
  //   let environment = this.state.environment;
  //   agents = agents.map((agent, index) => {
  //     return this.goOneStep(Math.floor(Math.random() * 4), agent, environment);
  //   });

  //   this.setState({agents});
  // }

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

  generateEnvironment() {
    let height = parseInt(this.heightInput.value),
        width = parseInt(this.widthInput.value);
    this.setState(
      {
        environment: Immutable.fromJS(Array(height).fill(Array(width).fill(OBSTACLE)))
      }, () => {

      });
  }

  //两件事：给RunningEnvironment.js传参；阻止用户继续设置环境
  configFinished() {
    this.setState({btn_finished_class: 'hide'});
    setTimeout(() => this.setState({btn_finished_class: 'hidden'}), 500);

    setTimeout(() => this.setState({btn_runOne_class: 'show'}), 500);
    setTimeout(() => this.setState({btn_runMuti_class: 'show'}), 650);
    
    let envri = this.state.environment.toArray();
    envri = envri.map((row) => {
      return row.toArray();
    });

    envri = envri.map((row) => {
      return row.map((square) => {
        switch (square) {
          case OPEN || AGENT:
            return 0;
          case OBSTACLE:
            return -1;
        }
      });
    });
    algorithm = new RunningEnvironment();
    algorithm.initBlock(envri);
    this.state.agents.forEach((agent) => {
      algorithm.addAgent(agent.id, {column: agent.column, row: agent.row})
    });

    algorithm.move();
    // window.algorithm = algorithm;
  }

  handleLeftBarSwipe(e) {
    if (Math.abs(e.angle) > 140) {
      if (this.state.regionBar_class) {
        this.setState({regionBar_class: ''});
        this.setState({agentBar_class: 'show_agentBar'});
      } else {
        this.setState({regionBar_class: 'show_regionBar'});
        this.setState({agentBar_class: ''});
      }
    }
  }

  handleLeftBarAgentClick(e) {
    let agentId = e.currentTarget.getAttribute('data-id');
    let agent = this.state.agents.get(agentId);
    agent.hidden = !agent.hidden;
    let agents = this.state.agents.set(agentId, agent);

    this.setState(agents)
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
        agentColors={agentColors}
        tipText={this.state.tipText}
        onMouseDown={this.handleMouseDownOnEnvironment.bind(this)}
        onMouseUp={this.handleMouseUpOnEnvironment.bind(this)}
        onMouseOver={this.handleMouseOverOnEnvironment.bind(this)}
      />
    ) : null;

    const leftBar = (
      <Hammer onSwipe={this.handleLeftBarSwipe.bind(this)}>
        <div className="leftBar">
          <div className={'hidden ' + this.state.agentBar_class}>
            {this.state.agents.map((agent, index) => (
              <div data-id={index} 
                className="agentBlock" 
                key={index} 
                onClick={this.handleLeftBarAgentClick.bind(this)}
              >
                <div className="agent" style={{background: agent.hidden ? '#8585ad' : agentColors[agent.id]}}>
                </div>
                <p className={agent.hidden ? ' light' : ''}>agent {index+1}</p>
              </div>
            ))}
          </div>
          <div id="regionBar" className={'hidden ' + this.state.regionBar_class}>
            {this.state.regions.map(this.constructRegionSketch.bind(this))}
          </div>
        </div>
      </Hammer>
    );

    const rightBar = (
      <div id="rightBar">
        <div className={`btn ${this.state.btn_runOne_class}`} onClick={this.runOneStep.bind(this)}>
          RUN 1 STEP
        </div>
        <div className={`btn ${this.state.btn_runMuti_class}`} onClick={this.runMutiSteps.bind(this)}>
          RUN <input type="text" ref={input => this.stepsInput = input}/> STEPS
        </div>
        <div 
          id="btn-finished" 
          className={`btn ${this.state.btn_finished_class}`} 
          onClick={this.configFinished.bind(this)}
        >
          FINISHED
        </div>
      </div>
    );


    const moreBar = (
      <div id="moreBar">
        <div>
          <p>Enter the size:</p>
          <div>
            width: <input type="text" ref={(input) => { this.widthInput = input; }}/>
          </div>
          <div>
            height: <input type="text" ref={(input) => { this.heightInput = input; }}/>
          </div>
          <div className="btn" onClick={this.generateEnvironment.bind(this)}>GENERATE</div>
        </div>
      </div>
    );
    
    return (
      <div>
        {moreBar}
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

// setTimeout(() => {
//   document.getElementsByClassName('leftBar')[0].style.left = window.innerWidth / 2 + 'px';
// }, 2000);