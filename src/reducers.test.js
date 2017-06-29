import fightTimerApp, {Status} from './reducers';

test('SET_NUM_ROUNDS updates the number of rounds', () => {
  expect(fightTimerApp({}, {type: 'SET_NUM_ROUNDS', numRounds: 10})).toEqual({
    numRounds: 10
  });
});

test('SET_COUNTDOWN_TIME updates the countdown time', () => {
  expect(fightTimerApp({}, {type: 'SET_COUNTDOWN_TIME', countdownTimeSecs: 10})).toEqual({
    countdownTimeSecs: 10
  });
});

test('SET_ROUND_TIME updates the round time', () => {
  expect(fightTimerApp({}, {type: 'SET_ROUND_TIME', roundTimeSecs: 10})).toEqual({
    roundTimeSecs: 10
  });
});

test('SET_WARNING_TIME updates the warning time', () => {
  expect(fightTimerApp({}, {type: 'SET_WARNING_TIME', warningTimeSecs: 10})).toEqual({
    warningTimeSecs: 10
  });
});

test('START sets the status to COUNTDOWN', () => {
  expect(fightTimerApp({}, {type: 'START'})).toEqual(expect.objectContaining({
    status: Status.COUNTDOWN
  }));
});

test('START sets timeRemainingSecs to countdownTimeSecs', () => {
  expect(fightTimerApp({countdownTimeSecs: 10}, {type: 'START'})).toEqual(expect.objectContaining({
    timeRemainingSecs: 10
  }));
});

test('TICK decreases timeRemainingSecs by 1', () => {
  expect(fightTimerApp({timeRemainingSecs: 10}, {type: 'TICK'})).toEqual({
    timeRemainingSecs: 9
  });
});

test('TICK flips the warning flag when timeRemainingSecs gets to be the warning time when in a round', () => {
  const state = {
    status: Status.ROUND,
    warningTimeSecs: 5,
    timeRemainingSecs: 6
  };
  expect(fightTimerApp(state, {type: 'TICK'})).toEqual(expect.objectContaining({
    timeRemainingSecs: 5,
    warning: true
  }));
});

test('TICK does not flip the warning flag when not in a round', () => {
  const state = {
    status: Status.REST,
    warningTimeSecs: 5,
    timeRemainingSecs: 6
  };
  expect(fightTimerApp(state, {type: 'TICK'})).not.toEqual(expect.objectContaining({
    warning: true
  }));
});

test('TICK does not flip the warning flag when in a round but before the warning time', () => {
  const state = {
    status: Status.ROUND,
    warningTimeSecs: 5,
    timeRemainingSecs: 7
  };
  expect(fightTimerApp(state, {type: 'TICK'})).not.toEqual(expect.objectContaining({
    warning: true
  }));
});

// TODO: Tests for TICK transition (timeRemainingSecs = 1)

test('PAUSE updates the status to PAUSED', () => {
  expect(fightTimerApp({}, {type: 'PAUSE'})).toEqual(expect.objectContaining({
    status: Status.PAUSED
  }));
});

test('PAUSE updates the statusBeforePause to whatever the status before being paused was', () => {
  expect(fightTimerApp({status: Status.ROUND}, {type: 'PAUSE'})).toEqual(expect.objectContaining({
    statusBeforePause: Status.ROUND
  }));
});

test('RESUME sets the status to the value of statusBeforePause', () => {
  expect(fightTimerApp({statusBeforePause: Status.REST}, {type: 'RESUME'})).toEqual(expect.objectContaining({
    status: Status.REST
  }));
});

test('FINISH resets the state to its uninintialized values', () => {
  expect(fightTimerApp({}, {type: 'FINISH'})).toEqual({
    status: Status.IDLE,
    currentRound: 0,
    timeRemainingSecs: -1
  });
});

test('unknown action simply returns the state', () => {
  const state = {isAState: true};
  expect(fightTimerApp(state, {type: 'UNKNOWN'})).toEqual(state);
});
