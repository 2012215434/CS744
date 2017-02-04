import React from 'react';

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

export {Board}