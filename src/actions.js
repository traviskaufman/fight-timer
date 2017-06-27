export function setNumRounds(numRounds) {
  return {
    type: 'SET_NUM_ROUNDS',
    numRounds
  };
}

export function setCountdownTime(countdownTimeSecs) {
  return {
    type: 'SET_COUNTDOWN_TIME',
    countdownTimeSecs
  };
}

export function setRoundTime(roundTimeSecs) {
  return {
    type: 'SET_ROUND_TIME',
    roundTimeSecs
  };
}

export function setWarningTime(warningTimeSecs) {
  return {
    type: 'SET_WARNING_TIME',
    warningTimeSecs
  };
}

export function start() {
  return {type: 'START'};
}

export function tick() {
  return {type: 'TICK'};
}

export function pause() {
  return {type: 'PAUSE'};
}

export function resume() {
  return {type: 'RESUME'};
}

export function finish() {
  return {type: 'FINISH'};
}
