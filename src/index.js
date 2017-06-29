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
// Note that html5 is needed for Safari to work correctly (ofc).
const soundInfo = {
  roundBegin: {
    src: [bellAudio],
    buffer: true,
    html5: true
  },
  roundEnd: {
    src: [bellSingleAudio],
    buffer: true,
    html5: true
  },
  roundWarning: {
    src: [fightSticksAudio],
    buffer: true,
    html5: true
  }
};
if (process.env.NODE_ENV === 'development') {
  Object.keys(soundInfo).forEach(k => {
    Object.assign(soundInfo[k], {
      onload: () => console.info('loaded:', k),
      onloaderror: e => console.error('loaderror:', k, '-', e)
    });
  });
}
const soundObjects = Object.keys(soundInfo).reduce((o, k) => ({...o, [k]: new Howl(soundInfo[k])}), {});
function hackAroundMobileAudioLimitations() {
  Object.keys(soundObjects).forEach(k => {
    const soundObj = soundObjects[k];
    soundObj.mute(true);
    soundObj.play();
    soundObj.stop();
    soundObj.mute(false);
  });
  window.removeEventListener('touchstart', hackAroundMobileAudioLimitations);
}
window.addEventListener('touchstart', hackAroundMobileAudioLimitations);

const soundsMiddleware = sounds(soundObjects);
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
