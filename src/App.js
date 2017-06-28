import moment from 'moment';
import 'moment-duration-format';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';

import {start, pause, resume, finish} from './actions';
import {Status} from './reducers';

const ButtonBar = styled.div`
  > button {
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const Button = styled.button.attrs({
  type: 'button'
})`
  appearance: none;
  border-radius: 2px;
  background: none;
  border: 2px solid white;
  color: white;
  text-transform: uppercase;
  font-size: 2rem;
  outline-color: white;
  cursor: pointer;
`;

const StatusHeader = styled.h4`
  color: ${({warning}) => warning ? 'red' : 'white'};
`;

const BigTime = styled.time`
  display: block;
  height: 40vh;
  line-height: 40vh;
  font-size: 6rem;
  font-weight: 700;
`;

const App = ({
  status,
  numRounds,
  currentRound,
  timeRemainingFormatted,
  warning,
  onStart,
  onPause,
  onResume,
  onEnd
}) => (
  <div>
    <div hidden={status !== Status.IDLE}>
      <Button onClick={onStart}>Start</Button>
    </div>
    <div hidden={status === Status.IDLE}>
      <StatusHeader warning={warning}>{statusText(status, numRounds, currentRound)}</StatusHeader>
      <BigTime>{timeRemainingFormatted}</BigTime>
      <ButtonBar>
        <Button onClick={status === Status.PAUSED ? onResume : onPause}>
          {status === Status.PAUSED ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={onEnd}>
          End
          </Button>
      </ButtonBar>
    </div>
  </div>
);
App.propTypes = {
  status: PropTypes.string.isRequired,
  numRounds: PropTypes.number.isRequired,
  currentRound: PropTypes.number.isRequired,
  timeRemainingFormatted: PropTypes.string.isRequired,
  warning: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired
};

function statusText(status, numRounds, currentRound) {
  const statusText = `Round ${currentRound} / ${numRounds}`;
  switch (status) {
    case Status.COUNTDOWN:
      return 'Get Ready!';
    case Status.PAUSED:
      return `(Paused)`;
    case Status.REST:
      return 'Rest';
    default:
      return statusText;
  }
}

function mapStateToProps(state) {
  const {numRounds, currentRound, timeRemainingSecs, status, warning} = state;
  return {
    status,
    numRounds,
    currentRound,
    warning,
    timeRemainingFormatted: moment.duration(timeRemainingSecs, 'seconds').format('mm:ss', {trim: false})
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStart: () => dispatch(start()),
    onPause: () => dispatch(pause()),
    onResume: () => dispatch(resume()),
    onEnd: () => dispatch(finish())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
