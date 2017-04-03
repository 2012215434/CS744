import React from 'react';
import {agentColors} from './agentColors';

class Graph extends React.Component {

  render() {
    console.log(this.props.historyTargetLists, this.props.curRegion, this.props.curStep);
    const targetList = 
    this.props.historyTargetLists 
    && this.props.curRegion  > -1 
    && this.props.historyTargetLists[this.props.curRegion][this.props.curStep]? (
      this.props.historyTargetLists[this.props.curRegion][this.props.curStep].map((target, index) => {
        return (
          <div className="target" key={index}>
            {`(${target.row}, ${target.column})`}
          </div>
        );
      })
    ) : null;

    return (
      <div id="graph" style={{display: (this.props.toggle === -1 ? 'none' : 'block')}}>
        <canvas className="graphView" width="400px" height="800px"></canvas>
        <div className="info hidden">
          <div>Node :</div>
          <div>Current agents:</div>
          <div className="agents current-agents">
          </div>
          <div>Visited agents:</div>
          <div className="agents visited-agents">
          </div>
        </div>
        <div className="info">
          <div>
            Target list
          </div>
          <div className="targetList">
            {targetList}
          </div>
          
        </div>
      </div>
    );
  }
}

export {Graph};