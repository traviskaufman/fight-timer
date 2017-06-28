import moment from 'moment';
import 'moment-duration-format';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
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

class App extends Component {
  static get propTypes() {
    return {
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
  }

  constructor(props) {
    super(props);
    this.handleStart = () => this.props.onStart();
    this.handlePause = () => this.props.onPause();
    this.handleResume = () => this.props.onResume();
  }

  render() {
    let statusText = `Round ${this.props.currentRound} / ${this.props.numRounds}`;
    switch (this.props.status) {
      case Status.COUNTDOWN:
        statusText = 'Get Ready!';
        break;
      case Status.PAUSED:
        statusText += ' (Paused)';
        break;
      case Status.REST:
        statusText = 'Rest';
        break;
      default:
        break;
    }
    return (
      <div>
        <div hidden={this.props.status !== Status.IDLE}>
          <Button onClick={this.handleStart}>Start</Button>
        </div>
        <div hidden={this.props.status === Status.IDLE}>
          <StatusHeader warning={this.props.warning}>{statusText}</StatusHeader>
          <BigTime>{this.props.timeRemainingFormatted}</BigTime>
          <ButtonBar>
            <Button onClick={this.props.status === Status.PAUSED ? this.handleResume : this.handlePause}>
              {this.props.status === Status.PAUSED ? 'Resume' : 'Pause'}
            </Button>
            <Button onClick={this.props.onEnd}>
              End
            </Button>
          </ButtonBar>
        </div>
      </div>
    );
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
