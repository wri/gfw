import { createElement, PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/analytics';
import { dateRange as dateRangeUtil } from 'utils/date-range';
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
      maxDate,
      startDateAbsolute,
      endDateAbsolute,
      maxRange,
      trimEndDate,
    } = this.props;

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

  async handleTimelineDates() {
    const { latestUrl } = this.props;
    if (latestUrl) {
      // Dynamic fetch based on URL within layer config
      await this.handleLatestUrlDates();
    } else {
      // dates based on timeline conf within layer config
      this.handleWidgetConfigDates();
    }
  }

  handleOnDateChange = (date, position, absolute) => {
    const { handleChange } = this.props;
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
  dateRange: PropTypes.shape({
    default: PropTypes.number,
    max: PropTypes.number,
    interval: PropTypes.string,
  }),
};

export default connect(mapStateToProps, null)(TimelineContainer);
