import React from 'react';
import {agentColors} from './agentColors';

class Graph extends React.Component {

  render() {
    const targets = this.props.targets,
        curStep = this.props.curStep,
        curRegion = this.props.curRegion;

    const targetList = 
    this.props.historyTargetLists 
    && curRegion  > -1 
    && this.props.historyTargetLists[curRegion][curStep]? (
      this.props.historyTargetLists[curRegion][curStep].map((target, index) => {
        return (
          <div className="target" key={index}>
            {`(${target.row}, ${target.column})`}
          </div>
        );
      })
    ) : null;
    
    let agentsIds = [];
    if (curRegion > -1) {
      this.props.agents.forEach((agent, index) => {
        let isInRegion = this.props.regions.get(curRegion).some((square) => {
          return square.row === agent.row && square.column === agent.column;
        });
        if (isInRegion) agentsIds.push(index);
      })
    }

    const curTargets = targets ? Object.keys(targets).map((key, index) => {
      return agentsIds.indexOf(index) > -1 && targets[key][curStep] ? (
        <div key={index}>
          <div className="curTargets-agent">
            {'Agent ' + (index + 1)}
          </div>
          <div className="target curTarget">
            {`(${targets[key][curStep].row}, ${targets[key][curStep].column})`}
          </div>
        </div>
      ) : null;
    }) : null;

    return (
      <div id="graph" style={{display: (this.props.toggle === -1 ? 'none' : 'block')}}>
        <canvas className="graphView" width="600px" height="800px"></canvas>
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
          <div className="curTargets">
            <div>
              <div>Agent</div>
              <div>Current target</div>
            </div>
            <div>
              {curTargets}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export {Graph};