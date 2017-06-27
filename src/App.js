import {Howl} from 'howler';
import moment from 'moment';
import 'moment-duration-format';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Observable, Subject} from 'rxjs';

import {tick, start, pause, resume} from './actions';
import './App.css';
import bellAudio from './audio/bell.mp3';
import bellSingleAudio from './audio/bell-single.mp3';
import fightSticksAudio from './audio/fight-sticks.mp3';

class App extends Component {
  static get propTypes() {
    return {
      status: PropTypes.string.isRequired,
      numRounds: PropTypes.number.isRequired,
      currentRound: PropTypes.number.isRequired,
      timeRemainingFormatted: PropTypes.string.isRequired,
      warning: PropTypes.bool.isRequired,
      start: PropTypes.func.isRequired,
      tick: PropTypes.func.isRequired,
      pause: PropTypes.func.isRequired,
      resume: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    this.handleStart = () => this.props.start();
    this.handlePause = () => this.props.pause();
    this.handleResume = () => this.props.resume();
    this.tickObservable = null;
    this.pauser = null;
    this.tickSubscription = null;
    this.sounds = {
      beginBell: new Howl({
        src: [bellAudio]
      }),
      endBell: new Howl({
        src: [bellSingleAudio]
      }),
      warningSticks: new Howl({
        src: [fightSticksAudio]
      })
    };
  }

  endTimer() {
    if (this.tickSubscription) {
      this.tickSubscription.unsubscribe();
    }
    this.tickSubscription = null;
    this.tickObservable = null;
    this.pauser = null;
  }

  startTimer() {
    this.tickObservable = Observable.interval(1000);
    this.pauser = new Subject();

    const pausable = this.pauser.switchMap(paused => paused ? Observable.never() : this.tickObservable);
    this.tickSubscription = pausable.subscribe(this.props.tick);
    this.pauser.next(false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.warning !== this.props.warning && this.props.warning) {
      this.sounds.warningSticks.play();
      return;
    }
    if (prevProps.status !== this.props.status) {
      if ((this.props.status === 'PAUSED' || prevProps.status === 'PAUSED') && this.pauser) {
        this.pauser.next(this.props.status === 'PAUSED');
        return;
      }

      const shouldStart = prevProps.status === 'IDLE';
      if (shouldStart) {
        this.startTimer();
        return;
      }

      if (this.props.status === 'ROUND') {
        this.sounds.beginBell.play();
      } else if (this.props.status === 'REST') {
        this.sounds.endBell.play();
      }

      const shouldEnd = this.props.status === 'IDLE';
      if (shouldEnd) {
        this.endTimer();
      }
    }
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
    start: () => dispatch(start()),
    pause: () => dispatch(pause()),
    resume: () => dispatch(resume()),
    tick: () => dispatch(tick())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
