import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';

import {Board1} from './Game';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('container')
  );
};

render(Board);

if (module.hot) {
  module.hot.accept('./Game', () => {
    render(Board)
  });
}