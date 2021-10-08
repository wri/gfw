import { createElement, PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { trackEvent } from "utils/analytics";
// import { dateRange as dateRangeUtil } from "utils/date-range";
import moment from 'moment';
import isEqual from 'lodash/isEqual';

import TimelineComponent from './component';
import { getMarks } from './selectors';

// @todo keeping this here for now as this is just a proof of concept
// If we decide this should go ahead in the future for more layers, lets make a service that deals with it
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

  constructor(props) {
    super(props);
    this.initialStartDate = createRef();
  }

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

  getSelectedStartDateFromLatest(dynamicMin, latest) {
    const { startDate, dateRange: configuredRange } = this.props;

    if (this.initialStartDate.current === null) {
      const defaultSelected = new Date(
        moment(new Date(latest))
          .subtract(configuredRange.default, configuredRange.interval)
          .format('YYYY-MM-DD')
      );
      this.initialStartDate.current = defaultSelected;
      return defaultSelected;
    }

    if (
      moment(startDate).isAfter(latest) ||
      moment(startDate).isBefore(dynamicMin)
    ) {
      return new Date(dynamicMin);
    }

    return new Date(startDate);
  }

  async handleLatestUrlDates() {
    const { latestUrl, trimEndDate, dateRange: configuredRange } = this.props;
    const latest = await getLatestDate(latestUrl);

    // Max min date, we subtract two years from it
    // @todo add this to the widget config to allow a larger dynamic date range
    const calcMin = new Date(
      moment(new Date(latest))
        .subtract(configuredRange.max, configuredRange.interval)
        .format('YYYY-MM-DD')
    );

    this.setState({
      from: {
        min: calcMin,
        max: new Date(latest),
        selected: this.getSelectedStartDateFromLatest(calcMin, latest),
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
  }

  handleWidgetConfigDates() {
    const {
      minDate,
      startDate,
      endDate,
      maxDate,
      maxRange,
      rangeInterval,
    } = this.props;

    let minDateDynamic = minDate;
    let maxDateDynamic = maxDate;

    if (maxRange) {
      const fromMaxRangeReached = moment(maxDate).diff(
        moment(minDate),
        rangeInterval,
        maxRange
      );

      if (fromMaxRangeReached > maxRange) {
        const default3MonthsBack = moment(endDate)
          .subtract(maxRange, rangeInterval)
          .format('YYYY-MM-DD');
        minDateDynamic = default3MonthsBack;
      }

      const toMaxDateReached = moment(maxDate).diff(
        moment(endDate),
        rangeInterval,
        maxRange
      );

      if (toMaxDateReached > maxRange) {
        maxDateDynamic = endDate;
      }
    }

    this.setState({
      from: {
        min: new Date(minDateDynamic),
        max: new Date(maxDateDynamic),
        selected: new Date(startDate),
      },
      to: {
        min: new Date(minDateDynamic),
        max: new Date(maxDateDynamic),
        selected: new Date(endDate),
      },
    });
  }

  handleOnDateChange(date, position, hasMaxRange) {
    const { handleChange, rangeInterval, maxRange } = this.props;
    const { from, to } = this.state;

    const getPosition = position === 0 ? 'from' : 'to';

    let fromDate;
    let toDate;

    if (hasMaxRange && getPosition === 'from') {
      const outsideMinRange = moment(date).isBefore(from.min);
      if (outsideMinRange) {
        fromDate = moment(date).format('YYYY-MM-DD');
        toDate = moment(date).add(maxRange, rangeInterval).format('YYYY-MM-DD');
      } else {
        fromDate = moment(date).format('YYYY-MM-DD');
        toDate = moment(to.max).format('YYYY-MM-DD');
      }
    }

    if (hasMaxRange && getPosition === 'to') {
      const outsideOfRange = moment(date).isAfter(to.max);
      if (outsideOfRange) {
        fromDate = moment(date)
          .subtract(maxRange, rangeInterval)
          .format('YYYY-MM-DD');
        toDate = moment(date).format('YYYY-MM-DD');
      } else {
        fromDate = moment(from.min).format('YYYY-MM-DD');
        toDate = moment(date).format('YYYY-MM-DD');
      }
    }

    const newRange = [fromDate, toDate];
    handleChange(newRange, this.props.activeLayer, hasMaxRange);
  }

  async handleTimelineDates() {
    this.handleWidgetConfigDates();
  }

  render() {
    return createElement(TimelineComponent, {
      ...this.props,
      ...this.state,
      handleOnDateChange: this.handleOnDateChange.bind(this),
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
  rangeInterval: PropTypes.number,
  trimEndDate: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  dateRange: PropTypes.shape({
    default: PropTypes.number,
    max: PropTypes.number,
    interval: PropTypes.string,
  }),
};

export default connect(mapStateToProps, null)(TimelineContainer);
