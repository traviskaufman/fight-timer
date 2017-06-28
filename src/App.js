import moment from 'moment';
import 'moment-duration-format';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {start, pause, resume} from './actions';
import './App.css';

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
      onResume: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.handleStart = () => this.props.onStart();
    this.handlePause = () => this.props.onPause();
    this.handleResume = () => this.props.onResume();
  }

  render() {
    return (
      <div className="App">
        <div style={{display: this.props.status === 'IDLE' ? 'block' : 'none'}}>
          <button type="button" onClick={this.handleStart}>Start</button>
        </div>
        <div style={{display: this.props.status === 'IDLE' ? 'none' : 'block'}}>
          <h3 style={{color: this.props.warning ? 'red' : 'black'}}>{this.props.status}</h3>
          <h4>Round {this.props.currentRound} / {this.props.numRounds}</h4>
          <div>
            <time>{this.props.timeRemainingFormatted}</time>
          </div>
          <div>
            <button type="button" onClick={this.props.status === 'PAUSED' ? this.handleResume : this.handlePause}>
              {this.props.status === 'PAUSED' ? 'Resume' : 'Pause'}
            </button>
          </div>
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
    onResume: () => dispatch(resume())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
