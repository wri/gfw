import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getAdminsSelected } from 'pages/country/widget/widget-selectors';

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

  return {
    location: location.payload,
    isLoading:
      widgetFAOForest.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    locationNames: getAdminsSelected({
      ...countryData,
      location: location.payload
    }),
    fao: widgetFAOForest.data.fao,
    rank: widgetFAOForest.data.rank
  };
};

class WidgetFAOForestContainer extends PureComponent {
  componentWillMount() {
    const { location, getFAOForestData } = this.props;
    getFAOForestData({ ...location });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getFAOForestData } = nextProps;

    if (!isEqual(location, this.props.location)) {
      getFAOForestData({ ...location });
    }
  }

  getChartData(props) {
    const {
      fao: {
        area_ha,
        extent,
        forest_planted,
        forest_primary,
        forest_regenerated
      }
    } = props;

    const naturallyRegenerated = extent / 100 * forest_regenerated;
    const primaryForest = extent / 100 * forest_primary;
    const plantedForest = extent / 100 * forest_planted;
    const nonForest =
      area_ha - (naturallyRegenerated + primaryForest + plantedForest);

    return [
      {
        name: 'Naturally regenerated Forest',
        value: naturallyRegenerated,
        color: '#959a00'
      },
      {
        name: 'Primary Forest',
        value: primaryForest,
        color: '#2d8700'
      },
      {
        name: 'Planted Forest',
        value: plantedForest,
        color: '#2d8700'
      },
      {
        name: 'Non-Forest',
        value: nonForest,
        color: '#d1d1d1'
      }
    ];
  }

  render() {
    return createElement(WidgetFAOForestComponent, {
      ...this.props,
      getChartData: this.getChartData
    });
  }
}

WidgetFAOForestContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getFAOForestData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetFAOForestContainer);
