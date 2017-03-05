import React from 'react';
import {agentColors} from './agentColors';

class Graph extends React.Component {

  render() {
    return (
      <div id="graph" style={{display: (this.props.toggle === -1 ? 'none' : 'block')}}>
        <canvas className="graphView" width="800px" height="800px"></canvas>
        <div className="info">
          <div>Node (3,3):</div>
          <div>Visited agents:</div>
          <div className="agents">
            <div className="agentPair">
              <div className="agent" style={{background: agentColors[0]}}>
              </div>
              <div>agent 1</div>
            </div>
            <div className="agentPair">
              <div className="agent" style={{background: agentColors[1]}}>
              </div>
              <div>agent 2</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export {Graph};