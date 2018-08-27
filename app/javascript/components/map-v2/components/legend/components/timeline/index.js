import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

import {
  addToDate,
  dateDiffInDays,
  formatDatePretty,
  formatDate
} from 'utils/dates';

import TimelineComponent from './component';
import { getTicks } from './selectors';

const mapStateToProps = (
  state,
  { maxDate, minDate, startDate, endDate, trimEndDate, ...props }
) => {
  const dates = {
    maxDate,
    minDate,
    startDate,
    endDate,
    trimEndDate
  };
  return {
    marks: getTicks({ dates }),
    ...props
  };
};

class TimelineContainer extends PureComponent {
  static defaultProps = {
    dateFormat: 'YYYY-MM-DD',
    interval: 'years',
    intervalStep: 1,
    speed: 200,
    count: 2,
    pushable: true
  };

  constructor(props) {
    super(props);
    const { minDate, maxDate, startDate, endDate, trimEndDate } = props;
    this.state = {
      isPlaying: false,
      min: 0,
      max: dateDiffInDays(maxDate, minDate),
      start: dateDiffInDays(startDate, minDate),
      end: dateDiffInDays(endDate, minDate),
      trim: dateDiffInDays(trimEndDate, minDate)
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

  componentWillUnmount() {
    this.stopTimeline();
  }

  incrementTimeline = nextState => {
    const { speed, minDate, intervalStep, interval } = this.props;
    const { start, end, trim } = nextState;
    this.interval = setTimeout(() => {
      const currentEndDate = moment(minDate).add(end, 'days');
      const newEndDate = moment(currentEndDate).add(intervalStep, interval);
      let newEndDays = moment(newEndDate).diff(minDate, 'days');

      if (end === trim) {
        newEndDays = start;
      } else if (newEndDays >= trim) {
        newEndDays = trim;
      }

      this.handleOnChange([start, newEndDays, trim]);
      this.handleOnAfterChange([start, newEndDays, trim]);
    }, speed);
  };

  startTimeline = () => {
    this.incrementTimeline(this.state);
  };

  stopTimeline = () => {
    clearInterval(this.interval);
  };

  handleTogglePlay = () => {
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying });
  };

  handleOnChange = range => {
    this.setState({
      start: range[0],
      end: range[1],
      trim: range[2]
    });
  };

  handleOnAfterChange = range => {
    const { handleChange } = this.props;
    const newRange = this.formatRange([range[0], range[1], range[2]]);
    handleChange(newRange);
  };

  formatRange = range => {
    const { minDate } = this.props;
    return range.map(r => formatDate(addToDate(minDate, r)));
  };

  formatDateString = value => {
    const { minDate, dateFormat } = this.props;
    return formatDatePretty(addToDate(minDate, value), dateFormat);
  };

  render() {
    return createElement(TimelineComponent, {
      ...this.props,
      ...this.state,
      startTimeline: this.startTimeline,
      stopTimeline: this.stopTimeline,
      handleTogglePlay: this.handleTogglePlay,
      handleOnChange: this.handleOnChange,
      handleOnAfterChange: this.handleOnAfterChange,
      formatDateString: this.formatDateString
    });
  }
}

TimelineContainer.propTypes = {
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  trimEndDate: PropTypes.string,
  handleChange: PropTypes.func,
  intervalStep: PropTypes.number,
  interval: PropTypes.string,
  speed: PropTypes.number,
  dateFormat: PropTypes.string
};

export default connect(mapStateToProps, null)(TimelineContainer);
