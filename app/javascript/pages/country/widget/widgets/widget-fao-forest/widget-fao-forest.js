import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { format } from 'd3-format';

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
    location: location.payload,
    config: widgetFAOForest.config
  });

  return {
    title: widgetFAOForest.title,
    anchorLink: widgetFAOForest.anchorLink,
    location: location.payload,
    isLoading:
      widgetFAOForest.isLoading ||
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading,
    fao,
    rank,
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

  getSentence = () => {
    const {
      locationNames,
      fao: {
        area_ha,
        extent,
        forest_planted,
        forest_primary,
        forest_regenerated
      },
      rank
    } = this.props;

    const naturallyRegenerated = extent / 100 * forest_regenerated;
    const primaryForest = extent / 100 * forest_primary;
    const plantedForest = extent / 100 * forest_planted;
    const nonForest =
      area_ha - (naturallyRegenerated + primaryForest + plantedForest);

    const sentence = `FAO data from 2015 shows that ${locationNames.current &&
      locationNames.current.label} is ${
      nonForest / area_ha > 0.5 ? 'mostly non-forest.' : 'mostly forest.'
    }${
      primaryForest > 0
        ? ` Primary forest occupies <strong>${format('.1f')(
          primaryForest / area_ha * 100
        )}%</strong> of the country. This gives ${locationNames.current &&
            locationNames.current
              .label} a rank of <strong>${rank}th</strong> out of 110 countries in terms of its relative amount of primary forest.`
        : ''
    }`;
    return sentence;
  };

  render() {
    return createElement(WidgetFAOForestComponent, {
      ...this.props,
      getSentence: this.getSentence
    });
  }
}

WidgetFAOForestContainer.propTypes = {
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  fao: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  getFAOForest: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(WidgetFAOForestContainer);
