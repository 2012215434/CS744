import React from 'react';

class Graph extends React.Component {

  render() {
    return (
      <div id="graph" style={{display: (this.props.toggle ? 'none' : 'block')}}>
        <canvas className="graphView" width="800px" height="800px"></canvas>
        <div className="info">

        </div>
      </div>
    );
  }
}

export {Graph};