import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/analytics';
import { dateRange as dateRangeUtil } from 'utils/date-range';
import moment from 'moment';
import isEqual from 'lodash/isEqual';

import TimelineComponent from './component';
import { getMarks } from './selectors';

const getLatestDate = (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((payload) => {
      if (payload && payload.data && payload.data.length > -1) {
        return payload.data[0].attributes.date;
      }
      return null;
    })
    .catch(() => {
      return null;
    });
};

const mapStateToProps = (
  state,
  { maxDate, minDate, startDate, endDate, trimEndDate, ...props }
) => {
  const dates = {
    maxDate,
    minDate,
    startDate,
    endDate,
    trimEndDate,
  };

  return {
    marks: getMarks({ dates }),
    ...props,
  };
};

class TimelineContainer extends PureComponent {
  state = {
    from: null,
    to: null,
    dynamic: false,
  };

  componentDidMount() {
    this.handleTimelineDates();
  }

  componentDidUpdate(prevProps) {
    const { startDate, endDate, minDate, maxDate } = this.props;
    const {
      startDate: prevStartDate,
      endDate: prevEndDate,
      minDate: prevMinDate,
      maxDate: prevMaxDate,
    } = prevProps;

    if (
      !isEqual(startDate, prevStartDate) ||
      !isEqual(endDate, prevEndDate) ||
      !isEqual(minDate, prevMinDate) ||
      !isEqual(maxDate, prevMaxDate)
    ) {
      this.handleTimelineDates();
    }
  }

  async handleTimelineDates() {
    const {
      latestUrl,
      minDate,
      maxDate,
      maxRange,
      trimEndDate,
      startDateAbsolute,
      endDateAbsolute,
      startDate,
      // dateRange,
    } = this.props;
    if (latestUrl) {
      const latest = await getLatestDate(latestUrl);
      const calcMin = new Date(
        moment(new Date(latest)).subtract(2, 'years').format('YYYY-MM-DD')
      );
      // .add(-Math.abs(parseInt(dateRange.default, 10)), dateRange.interval).format('YYYY-MM-DD')

      this.setState({
        from: {
          min: calcMin,
          max: new Date(latest),
          selected: new Date(
            moment(startDateAbsolute).isBefore(calcMin)
              ? calcMin
              : startDateAbsolute
          ),
        },
        to: {
          min: calcMin,
          max: new Date(latest),
          selected: new Date(
            moment(trimEndDate).isAfter(latest) ? latest : trimEndDate
          ),
        },
        dynamic: true,
      });
    } else {
      this.setState({
        from: {
          min: new Date(minDate),
          max: new Date(maxRange ? maxDate : trimEndDate),
          selected: new Date(maxRange ? startDateAbsolute : startDate),
        },
        to: {
          min: new Date(maxRange ? minDate : startDate),
          max: new Date(maxDate),
          selected: new Date(maxRange ? endDateAbsolute : trimEndDate),
        },
      });
    }
  }

  handleOnDateChange = (date, position, absolute) => {
    const { handleChange } = this.props;
    this.setState({ shouldSet: false });
    const newRange = dateRangeUtil(this.props, date, position, absolute);
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
  latestUrl: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  maxRange: PropTypes.string,
  trimEndDate: PropTypes.string,
  startDateAbsolute: PropTypes.string,
  endDateAbsolute: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  // dateRange: PropTypes.string,
};

export default connect(mapStateToProps, null)(TimelineContainer);
