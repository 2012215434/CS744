import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton'

import {Game} from './Game';
import {History} from './History';

class Main extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="main">
        <Game/>
      </div>
    );
  }
}

ReactDOM.render(
  <Main/>,
  document.getElementById('container')
);