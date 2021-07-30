import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/analytics';
import { dateRange } from 'utils/date-range';
import moment from 'moment';
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

  async fetchMinDate() {
    const { latestUrl, dateRange, interval, handleChange } = this.props;
    if (latestUrl) {
      const latest = await getLatestDate(latestUrl);
      console.log('prosp', this.props);
      if (latest) {
        const min = moment(new Date(latest)).add(-Math.abs(parseInt(dateRange.default, 10)), dateRange.interval).format('YYYY-MM-DD');
        const max = moment(new Date(latest)).format('YYYY-MM-DD');
        console.log('min', min)
        console.log('max', max);
        handleChange([min, max, max], this.props.activeLayer, true);
      }
    }
  }

  componentDidMount() {
    this.fetchMinDate();
  }

  handleOnDateChange = (date, position, absolute) => {
    const { handleChange } = this.props;
    this.setState({ shouldSet: false });
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
      dyno: true,
      handleOnDateChange: this.handleOnDateChange,
    });
  }
}

TimelineContainer.propTypes = {
  handleChange: PropTypes.func,
  activeLayer: PropTypes.object,
  latestUrl: PropTypes.string,
  step: PropTypes.number,
  interval: PropTypes.string,
};

export default connect(mapStateToProps, null)(TimelineContainer);
