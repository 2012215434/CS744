import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

const OPEN = 'open',
      OBSTACLE = 'obstacle',
      AGENT = 'agent';

function Square(props) { 
  const className = 
    ( props.info ? 'inner-square ' + props.info : 'square ' + props.info ) + 
    ( props.row == 0 ? ' top' : '' ) + 
    ( props.column == 0 ? ' left ' : '' )
  return (
    <div 
      className={className}
      data-row={props.row}
      data-column={props.column}
    >
    </div>
  );
}

class Row extends React.Component {
  renderSquares(num) {
    let squares = [];
    for(let i = 0; i < num; i++) {
      squares.push(<Square key={i} row={this.props.rIndex} column={i} info={this.props.rowInfo.get(i)}/>);
    }
    return squares;
  }
  
  render() {
    return (
      <div className="row">
        {this.renderSquares(this.props.num)}
        <div className="clearFloat"></div>
      </div>
    );
  }
}

class Board extends React.Component {
  renderRows(rNum, cNum) {
    let rows = [];
    for(let i = 0; i < rNum; i++) { 
      rows.push(<Row key={i} rIndex={i} num={cNum} rowInfo={this.props.board.get(i)}/>);
    }
    return rows; 
  }
  
  render() {
    return (
      <div 
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseOver={this.props.onMouseOver} 
        id={this.props.id}>
        {this.renderRows(this.props.board.size, this.props.board.get(0).size)}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      background: Immutable.fromJS(Array(30).fill(Array(30).fill(""))),
      environment: null,
      mouseDown: false,
      environmentSettled: false,
      initial: true
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

  componentDidMount() {
    setTimeout(setPosition, 0);
    setTimeout(setPosition, 500);
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

  handleMouseUpOnEnvironment(e) {
    if(this.state.mouseDown){
      this.setState({mouseDown: false});
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
      this.setState({
        environment: Immutable.fromJS(Array(height).fill(Array(width).fill(OBSTACLE)))
      }, () => {
        document.getElementById('environment').style.top = this.mouseDownCoor.top;
        document.getElementById('environment').style.left = this.mouseDownCoor.left;
      });
    }
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
      <Board id="environment" board={this.state.environment} onMouseUp={this.handleMouseUpOnEnvironment.bind(this)}/>
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

export {Board};

function setPosition(){
  let background = document.getElementById('background');
  let top = (window.innerHeight - background.clientHeight) / 2,
  left = (window.innerWidth - background.clientWidth) / 2;
  background.style.top = top;
  background.style.left = left;
}

//update Immutable.js list of lists
Immutable.List.prototype.update = function (row, column, value){
  console.log(this.size);
  if(this.size == 0) return;
  return this.set(row, this.get(row).set(column, value))
}