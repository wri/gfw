import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import isEqual from 'lodash/isEqual';

import TimelineComponent from './component';
import { getTicks } from './selectors';

const requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

const requestTimeout = function(fn, delay) {
  if( !window.requestAnimationFrame       &&
    !window.webkitRequestAnimationFrame &&
    !(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
    !window.oRequestAnimationFrame      &&
    !window.msRequestAnimationFrame)
      return window.setTimeout(fn, delay);

  var start = new Date().getTime(),
    handle = new Object();

  function loop(){
    var current = new Date().getTime(),
      delta = current - start;

    delta >= delay ? fn.call() : handle.value = requestAnimFrame(loop);
  };

  handle.value = requestAnimFrame(loop);
  return handle;
};

const clearRequestTimeout = function(handle) {
  window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
  window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
  window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
  window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
  window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
  window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
  clearTimeout(handle);
};


const mapStateToProps = (state, { maxDate, minDate, startDate, endDate, trimEndDate, ...props }) => {
  const dates = {
    maxDate, minDate, startDate, endDate, trimEndDate
  };
  return {
    marks: getTicks({ dates }),
    ...props
  };
};

class TimelineContainer extends PureComponent {
  constructor(props) {
    super(props);
    const { minDate, maxDate, startDate, endDate, trimEndDate } = props;
    this.state = {
      isPlaying: false,
      min: 0,
      max: moment(maxDate).diff(minDate, 'days'),
      start: moment(startDate).diff(minDate, 'days'),
      end: moment(endDate).diff(minDate, 'days'),
      trim: moment(trimEndDate).diff(minDate, 'days')
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { isPlaying, end } = nextState;
    if (isPlaying && isPlaying !== this.state.isPlaying) {
      this.startTimeline();
    }
    if (!isPlaying && isPlaying !== this.state.isPlaying) {
      this.stopTimeline();
    }
    if (isPlaying && !isEqual(end, this.state.end)) {
      this.incrementTimeline(nextState);
    }
  }

  incrementTimeline = nextState => {
    const { speed, minDate, intervalStep, interval } = this.props;
    const { start, end, trim } = nextState;

    this.interval = requestTimeout(() => {
      const currentEndDate = moment(minDate).add(end, 'days').format('YYYY-MM-DD');
      let newEndDate = moment(currentEndDate).add(intervalStep, interval).format('YYYY-MM-DD')
      newEndDate = moment(newEndDate).diff(minDate, 'days');
      if (end === trim) {
        newEndDate = start;
      } else if (newEndDate >= trim) {
        newEndDate = trim;
      }
      this.handleOnChange([start, newEndDate, trim])
      this.handleOnAfterChange([start, newEndDate, trim])
    }, speed);
  }

  startTimeline = () => {
    this.incrementTimeline(this.state);
  }

  stopTimeline = () => {
    // clearInterval(this.interval);
    clearRequestTimeout(this.interval);
  }

  handleTogglePlay = () => {
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying });
  }

  handleOnChange = range => {
    this.setState({ start: range[0], end: range[1], trim: range[2] });
  }

  handleOnAfterChange = range => {
    const { handleChange } = this.props;
    const newRange = this.formatRange(range);
    handleChange(newRange)
  }

  formatRange = range => {
    const { dateFormat, minDate } = this.props;
    return range.map(r => moment(minDate).add(r, 'days').format(dateFormat));
  }

  render() {
    return createElement(TimelineComponent, {
      ...this.props,
      ...this.state,
      startTimeline: this.startTimeline,
      stopTimeline: this.stopTimeline,
      handleTogglePlay: this.handleTogglePlay,
      handleOnChange: this.handleOnChange,
      handleOnAfterChange: this.handleOnAfterChange,
      formatDate: this.formatDate
    });
  }
}

TimelineContainer.defaultProps = {
  dateFormat: 'YYYY-MM-DD',
  interval: 'years',
  intervalStep: 1,
  speed: 200,
  count: 2,
  trackStyle: [
    { backgroundColor: 'green', borderRadius: '0px' },
    { backgroundColor: '#d6d6d9' }
  ],
  handleStyle: [
    {
      backgroundColor: 'white',
      borderRadius: '2px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
      border: '0px'
    },
    { visibility: 'hidden' },
    {
      backgroundColor: 'white',
      borderRadius: '2px',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
      border: '0px'
    }
  ],
  railStyle: { backgroundColor: '#d6d6d9' },
  dotStyle: { display: 'none', border: '0px' },
  pushable: true
};

TimelineContainer.propTypes = {
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  trimEndDate: PropTypes.string,
  handleChange: PropTypes.func,
  dateFormat: PropTypes.string,
  intervalStep: PropTypes.number,
  interval: PropTypes.string,
  speed: PropTypes.number
};

export default connect(mapStateToProps, null)(TimelineContainer);
