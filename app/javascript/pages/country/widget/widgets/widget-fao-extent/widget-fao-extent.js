import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { format } from 'd3-format';
import {
  getPeriods,
  getActiveFilter
} from 'pages/country/widget/widget-selectors';

import WidgetTreeCoverGainComponent from './widget-fao-extent-component';
import actions from './widget-fao-extent-actions';

export { initialState } from './widget-fao-extent-reducers';
export { default as reducers } from './widget-fao-extent-reducers';
export { default as actions } from './widget-fao-extent-actions';

const PERIODS_LIST = [
  {
    label: '1990–2000',
    value: 1990
  },
  {
    label: '2000–2005',
    value: 2000
  },
  {
    label: '2005–2010',
    value: 2005
  },
  {
    label: '2010–2015',
    value: 2010
  }
];

const mapStateToProps = ({ countryData, widgetFAOExtent, location }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  return {
    location: location.payload,
    isLoading:
      widgetFAOExtent.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    data: widgetFAOExtent.data,
    periods: getPeriods({ data: PERIODS_LIST }) || [],
    settings: widgetFAOExtent.settings
  };
};

class WidgetFAOExtentContainer extends PureComponent {
  componentWillMount() {
    const { location, settings, getFAOExtentData } = this.props;
    getFAOExtentData({
      ...location,
      ...settings
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getFAOExtentData } = nextProps;

    if (
      !isEqual(location, this.props.location) ||
      !isEqual(settings.period, this.props.settings.period)
    ) {
      getFAOExtentData({
        ...location,
        ...settings
      });
    }
  }

  getSentence = () => {
    const { data, periods, settings } = this.props;
    const period = getActiveFilter(settings, periods, 'period');

    return {
      __html: `From <strong>${
        period.label
      }</strong>, the rate of reforestation in <strong>${
        data.name
      }</strong> was <strong>${format(',')(data.rate * 1000)} ha/year</strong>.`
    };
  };

  render() {
    return createElement(WidgetTreeCoverGainComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetFAOExtentContainer.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  periods: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  getFAOExtentData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetFAOExtentContainer);
