import {Howl} from 'howler';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';

import fightTimerApp from './reducers';
import {sounds, timerInterval} from './middleware';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import bellAudio from './audio/bell.mp3';
import bellSingleAudio from './audio/bell-single.mp3';
import fightSticksAudio from './audio/fight-sticks.mp3';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const timerMiddleware = timerInterval();
const soundsMiddleware = sounds({
  roundBegin: new Howl({
    src: [bellAudio]
  }),
  roundEnd: new Howl({
    src: [bellSingleAudio]
  }),
  roundWarning: new Howl({
    src: [fightSticksAudio]
  })
});
const store = createStore(fightTimerApp, composeEnhancers(
  applyMiddleware(timerMiddleware, soundsMiddleware)
));

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
