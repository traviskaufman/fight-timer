import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import fightTimerApp from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css'; // eslint-disable-line import/no-unassigned-import

const store = createStore(
  fightTimerApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
