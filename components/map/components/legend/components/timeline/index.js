import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/analytics';
import { dateRange } from 'utils/date-range';

import TimelineComponent from './component';
import { getMarks } from './selectors';

const mapStateToProps = (
  state,
  {
    maxDate,
    minDate,
    startDate,
    endDate,
    trimEndDate,
    step,
    matchLegend,
    dynamicTimeline,
    ...props
  }
) => {
  const dates = {
    maxDate,
    minDate,
    startDate,
    endDate,
    trimEndDate,
    dynamicTimeline,
  };
  return {
    marks: getMarks({ dates, step, matchLegend, dynamicTimeline }),
    step,
    ...props,
  };
};

class TimelineContainer extends PureComponent {
  handleOnDateChange = (date, position, absolute) => {
    const { handleChange } = this.props;

    const newRange = dateRange(this.props, date, position, absolute);

    handleChange(newRange, this.props.activeLayer, absolute);

    trackEvent({
      category: 'Map legend',
      action: `User changes date range for ${this.props.activeLayer.id}`,
      label: `${newRange[0]}:${newRange[2]}`,
    });
  };

  render() {
    return createElement(TimelineComponent, {
      ...this.props,
      ...this.state,
      handleOnDateChange: this.handleOnDateChange,
    });
  }
}

TimelineContainer.propTypes = {
  handleChange: PropTypes.func,
  activeLayer: PropTypes.object,
};

export default connect(mapStateToProps, null)(TimelineContainer);
