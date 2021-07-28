import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/analytics';
import { dateRange } from 'utils/date-range';

import TimelineComponent from './component';
import { getMarks } from './selectors';

const getLatestDate = (url, defaultDate) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const latest = data[0]?.attributes?.date;
      return latest || defaultDate;
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
    minDate: '',
  };

  async fetchMinDate() {
    const { minDate } = this.props;
    // if props.url from layer, we should only perform this fetch if present
    const latest = await getLatestDate(
      'https://api.resourcewatch.org/glad-alerts/latest',
      minDate
    );
    // else, do nothing
    if (latest) {
      this.setState({ minDate: latest });
    } else {
      this.setState({ minDate });
    }
  }

  componentDidMount() {
    this.fetchMinDate();
  }

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
  minDate: PropTypes.string,
};

export default connect(mapStateToProps, null)(TimelineContainer);
