import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { logEvent } from 'app/analytics';

import TimelineComponent from './component';
import getTicks from './selectors';

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
  handleOnDateChange = (date, position, absolute) => {
    const { startDate, endDate, trimEndDate, startDateAbsolute, endDateAbsolute, handleChange, rangeInterval, maxRange } = this.props;
    const newRange = absolute ? [startDateAbsolute, endDateAbsolute, endDateAbsolute] : [startDate, endDate, trimEndDate];
    newRange[position] = date.format('YYYY-MM-DD');
    if (position) {
      newRange[position - 1] = date.format('YYYY-MM-DD');
    }

    const diffInterval = moment(newRange[2]).diff(moment(newRange[0]), rangeInterval);
    if (!diffInterval || diffInterval >= maxRange || diffInterval < 0) {
      if (position) {
        newRange[0] = date.subtract(maxRange, rangeInterval).format('YYYY-MM-DD');
      } else {
        const newDate = date.add(maxRange, rangeInterval).format('YYYY-MM-DD');
        newRange[2] = newDate;
        newRange[1] = newDate;
      }
    }
    handleChange(newRange, this.props.activeLayer, absolute);

    logEvent('legendTimelineChange', {
      action: `User changes date range for ${this.props.activeLayer.id}`,
      label: `${newRange[0]}:${newRange[2]}`
    });
  };

  render() {
    return createElement(TimelineComponent, {
      ...this.props,
      ...this.state,
      handleOnDateChange: this.handleOnDateChange
    });
  }
}

TimelineContainer.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  trimEndDate: PropTypes.string,
  handleChange: PropTypes.func,
  activeLayer: PropTypes.object,
  rangeInterval: PropTypes.string,
  maxRange: PropTypes.number,
  startDateAbsolute: PropTypes.string,
  endDateAbsolute: PropTypes.string
};

export default connect(mapStateToProps, null)(TimelineContainer);
