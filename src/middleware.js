import {tick} from './actions';
import {Status} from './reducers';

export const timerInterval = () => store => next => {
  let intervalId = 0;
  const callback = () => store.dispatch(tick());

  const start = () => {
    intervalId = setInterval(callback, 1000);
  };
  const end = () => clearInterval(intervalId);

  return action => {
    const {status, timeRemainingSecs, numRounds, currentRound} = store.getState();
    switch (action.type) {
      case 'START':
      case 'RESUME':
        start();
        break;
      case 'PAUSE':
      case 'FINISH':
        end();
        break;
      case 'TICK':
        if (status === Status.ROUND && currentRound === numRounds && (timeRemainingSecs - 1) === 0) {
          end();
        }
        break;
      default:
        break;
    }
    return next(action);
  };
};

export const sounds = ({
  roundBegin = {play() {}},
  roundEnd = {play() {}},
  roundWarning = {play() {}}
} = {}) => store => next => {
  let currentStatus;
  let currentIsWarning;
  return action => {
    const result = next(action);
    if (action.type !== 'TICK') {
      return result;
    }

    const {status, warning} = store.getState();
    const prevStatus = currentStatus;
    const prevIsWarning = currentIsWarning;
    currentStatus = status;
    currentIsWarning = warning;

    if (prevIsWarning !== currentIsWarning && currentIsWarning) {
      roundWarning.play();
    } else if (prevStatus !== currentStatus) {
      const isRoundBegin = (
        (prevStatus === Status.COUNTDOWN && currentStatus === Status.ROUND) ||
        (prevStatus === Status.REST && currentStatus === Status.ROUND)
      );
      const isRoundEnd = (
        (prevStatus === Status.ROUND && currentStatus === Status.REST) ||
        (prevStatus === Status.ROUND && currentStatus === Status.IDLE)
      );
      if (isRoundBegin) {
        roundBegin.play();
      } else if (isRoundEnd) {
        roundEnd.play();
      }
    }

    return result;
  };
};
