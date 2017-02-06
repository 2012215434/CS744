import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import {Board} from './Board';

const OPEN = 'open',
      OBSTACLE = 'obstacle',
      AGENT = 'agent';

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      background: Immutable.fromJS(Array(20).fill(Array(20).fill(""))),
      environment: null,
      mouseDown: false,
      mouseDownOnEnvir: false,
      environmentSettled: false,
      initial: true,
      regions: Immutable.List([])
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

  // componentDidMount() {
  //   setTimeout(setPosition, 0);
  //   setTimeout(setPosition, 500);
  // }

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
      console.log(this.state.regions);
    }
  }

  handleMouseDownOnEnvironment(e) {
    e.preventDefault();
    this.setState({mouseDownOnEnvir: true});
    let target = e.target;
    this.setState({regions: this.state.regions.push([])}, () => {this.setOpen(target)})
  }

  handleMouseOverOnEnvironment(e) {
    if(this.state.mouseDownOnEnvir) {
      this.setOpen(e.target);
    }
  }

  setOpen(target) {
    let row = target.getAttribute('data-row'),
        column = target.getAttribute('data-column');
    let regions = this.state.regions,
        connectedToOtherRegions = false;
    for(let i = 0; i < regions.size - 1 ; i++) {
      let region = regions.get(i);
      for(let j = 0; j < region.length; j++) {
        if((row == region[j].row && column == region[j].column - 1) || 
           (row == region[j].row && column == region[j].column + 1) || 
           (column == region[j].column && row == region[j].row - 1) || 
           (column == region[j].column && row == region[j].row + 1)) {
              return;
            }
      }
    }
    let region = regions.last();
    for(let i = 0; i < region.length; i ++) {
      if(row == region[i].row && column == region[i].column) {
        return;
      }
    }
    this.setState({environment: this.state.environment.update(row, column, OPEN)});

    region = JSON.parse(JSON.stringify(region));
    region.push({row: Number(row), column: Number(column)});
    this.setState({regions: regions.set(-1, region)});
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
        onMouseDown={this.handleMouseDownOnEnvironment.bind(this)}
        onMouseUp={this.handleMouseUpOnEnvironment.bind(this)}
        onMouseOver={this.handleMouseOverOnEnvironment.bind(this)}
      />
    ) : null;
    
    return (
      <div>
        {background}
        {environment}
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