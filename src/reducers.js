import update from 'immutability-helper';

export const Status = {
  IDLE: 'IDLE',
  COUNTDOWN: 'COUNTDOWN',
  ROUND: 'ROUND',
  PAUSED: 'PAUSED',
  REST: 'REST'
};

const initialState = {
  numRounds: 3,
  countdownTimeSecs: 5,
  roundTimeSecs: 3 * 60,
  restTimeSecs: 30,
  warningTimeSecs: 10,
  status: Status.IDLE,
  currentRound: 0,
  timeRemainingSecs: -1,
  warning: false,
  statusBeforePause: Status.IDLE
};

function fightTimerApp(state = initialState, action) {
  let timeRemainingSecs;
  switch (action.type) {
    case 'SET_NUM_ROUNDS':
      return update(state, {numRounds: {$set: action.numRounds}});
    case 'SET_COUNTDOWN_TIME':
      return update(state, {countdownTimeSecs: {$set: action.countdownTimeSecs}});
    case 'SET_ROUND_TIME':
      return update(state, {roundTimeSecs: {$set: action.roundTimeSecs}});
    case 'SET_WARNING_TIME':
      return update(state, {warningTimeSecs: {$set: action.warningTimeSecs}});
    case 'START':
      return update(state, {
        $merge: {
          status: Status.COUNTDOWN,
          timeRemainingSecs: state.countdownTimeSecs
        }
      });
    case 'TICK':
      timeRemainingSecs = state.timeRemainingSecs - 1;
      if (state.status === Status.ROUND && timeRemainingSecs === state.warningTimeSecs) {
        return update(state, {$merge: {warning: true, timeRemainingSecs}});
      }
      if (timeRemainingSecs === 0) {
        return transitionStatus(state);
      }
      return update(state, {timeRemainingSecs: {$set: timeRemainingSecs}});
    case 'PAUSE':
      return update(state, {
        $merge: {
          status: Status.PAUSED,
          statusBeforePause: state.status
        }
      });
    case 'RESUME':
      return update(state, {
        $merge: {
          status: state.statusBeforePause
        }
      });
    case 'FINISH':
      return update(state, {
        $merge: {
          status: Status.IDLE,
          currentRound: 0,
          timeRemainingSecs: -1
        }
      });
    default:
      return state;
  }
}

function transitionStatus(state) {
  switch (state.status) {
    case Status.COUNTDOWN:
      return update(state, {
        $merge: {
          status: Status.ROUND,
          timeRemainingSecs: state.roundTimeSecs,
          currentRound: state.currentRound + 1
        }
      });
    case Status.ROUND:
      if (state.currentRound === state.numRounds) {
        return update(state, {
          $merge: {
            status: Status.IDLE,
            currentRound: 0,
            timeRemainingSecs: -1,
            warning: false
          }
        });
      }
      return update(state, {
        $merge: {
          status: Status.REST,
          timeRemainingSecs: state.restTimeSecs,
          warning: false
        }
      });
    case Status.REST:
      return update(state, {
        $merge: {
          status: Status.ROUND,
          timeRemainingSecs: state.roundTimeSecs,
          currentRound: state.currentRound + 1
        }
      });
    default:
      return state;
  }
}

export default fightTimerApp;
