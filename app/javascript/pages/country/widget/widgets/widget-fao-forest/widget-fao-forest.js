import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getAdminsSelected } from 'pages/country/widget/widget-selectors';
import { getFAOForestData } from './widget-fao-forest-selectors';

import WidgetFAOForestComponent from './widget-fao-forest-component';
import actions from './widget-fao-forest-actions';

export { initialState } from './widget-fao-forest-reducers';
export { default as reducers } from './widget-fao-forest-reducers';
export { default as actions } from './widget-fao-forest-actions';

const mapStateToProps = ({ countryData, widgetFAOForest, location }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  const { fao, rank } = widgetFAOForest.data;
  const locationNames = getAdminsSelected({
    ...countryData,
    location: location.payload
  });

  return {
    location: location.payload,
    isLoading:
      widgetFAOForest.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    locationNames,
    data: getFAOForestData({ fao, rank, locationNames }) || {}
  };
};

class WidgetFAOForestContainer extends PureComponent {
  componentWillMount() {
    const { location, getFAOForest } = this.props;
    getFAOForest({ ...location });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getFAOForest } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getFAOForest({ ...location });
    }
  }

  render() {
    return createElement(WidgetFAOForestComponent, {
      ...this.props,
      getWidgetValues: this.getWidgetValues,
      getSentence: this.getSentence,
      getChartData: this.getChartData
    });
  }
}

WidgetFAOForestContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getFAOForest: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetFAOForestContainer);
