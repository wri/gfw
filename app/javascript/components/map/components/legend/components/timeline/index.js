import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { track } from 'app/analytics';

import TimelineComponent from './component';
import { getMarks } from './selectors';

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
    marks: getMarks({ dates }),
    ...props
  };
};

class TimelineContainer extends PureComponent {
  handleOnDateChange = (date, position) => {
    const { startDate, endDate, trimEndDate, handleChange } = this.props;
    const newRange = [startDate, endDate, trimEndDate];
    newRange[position] = date.format('YYYY-MM-DD');
    if (position) {
      newRange[position - 1] = date.format('YYYY-MM-DD');
    }
    handleChange(newRange, this.props.activeLayer);

    track('legendTimelineChange', {
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
  activeLayer: PropTypes.object
};

export default connect(mapStateToProps, null)(TimelineContainer);
