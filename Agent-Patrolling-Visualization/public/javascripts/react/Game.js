import React from 'react';
import Immutable from 'immutable';

function Square(props) { 
  return (
    <div className="square">
      {props.info}
    </div>
  );
}

class Row extends React.Component {
  renderSquares(num) {
    let squares = [];
    for(let i = 0; i < num; i++) {
      squares.push(<Square key={i} row={this.props.rIndex} colunm={i} info={this.props.rowInfo.get(i)}/>);
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
  constructor(){
    super();
    this.state = {
      boardInfo: Immutable.fromJS(Array(30).fill(Array(30).fill("")))
    };
  }
  
  renderRows(rNum, cNum) {
    setTimeout(() => {
      this.setState({
        boardInfo: this.state.boardInfo.update(9, 8, 123)
      });
    }, 1000);
    let rows = [];
    for(let i = 0; i < rNum; i++) { 
      rows.push(<Row key={i} rIndex={i} num={cNum} rowInfo={this.state.boardInfo.get(i)}/>);
    }
    return rows; 
  }
  
  render() {
    return (
      <div>
        {this.renderRows(30, 30)}
      </div>
    )
  }
}

// ReactDOM.render(
//   <Board />,
//   document.getElementById('container')
// );

export {Board};

//update Immutable.js list of lists
Immutable.List.prototype.update = function (row, column, value){
  return this.set(row, this.get(row).set(column, value))
}