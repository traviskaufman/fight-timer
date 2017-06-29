import * as actions from './actions';

test('setNumRounds', () => {
  expect(actions.setNumRounds(5)).toEqual({
    type: 'SET_NUM_ROUNDS',
    numRounds: 5
  });
});

test('setCountdownTime', () => {
  expect(actions.setCountdownTime(10)).toEqual({
    type: 'SET_COUNTDOWN_TIME',
    countdownTimeSecs: 10
  });
});

test('setRoundTime', () => {
  expect(actions.setRoundTime(10)).toEqual({
    type: 'SET_ROUND_TIME',
    roundTimeSecs: 10
  });
});

test('setWarningTime', () => {
  expect(actions.setWarningTime(10)).toEqual({
    type: 'SET_WARNING_TIME',
    warningTimeSecs: 10
  });
});

test('start', () => {
  expect(actions.start()).toEqual({
    type: 'START'
  });
});

test('pause', () => {
  expect(actions.pause()).toEqual({
    type: 'PAUSE'
  });
});

test('resume', () => {
  expect(actions.resume()).toEqual({
    type: 'RESUME'
  });
});

test('finish', () => {
  expect(actions.finish()).toEqual({
    type: 'FINISH'
  });
});
