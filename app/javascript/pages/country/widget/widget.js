import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';

import * as widgetSelectors from 'pages/country/widget/widget-selectors';
import Component from './widget-component';
import actions from './widget-actions';

const mapStateToProps = (state, ownProps) => {
  const { location, countryData } = state;
  const { title, config, settings, loading, data } = state[
    `widget${upperFirst(ownProps.widget)}`
  ];
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isWhitelistLoading
  } = countryData;
  const adminData = {
    location: location.payload,
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  const options = {};
  if (config.selectors) {
    config.selectors.forEach(selector => {
      const selectorFunc = widgetSelectors[`get${upperFirst(selector)}`];
      switch (selector) {
        case 'indicators':
          options[selector] = selectorFunc({
            config,
            location: location.payload,
            ...countryData
          });
          break;
        case 'startYears':
          options[selector] = selectorFunc({
            data: data.loss,
            ...settings
          });
          break;
        case 'endYears':
          options[selector] = selectorFunc({
            data: data.loss,
            ...settings
          });
          break;
        default:
          options[selector] = selectorFunc();
      }
    });
  }

  return {
    isMetaLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isWhitelistLoading,
    locationNames: widgetSelectors.getAdminsSelected(adminData),
    activeLocation: widgetSelectors.getActiveAdmin({
      location: location.payload
    }),
    location: location.payload,
    title,
    settingsConfig: {
      config,
      settings,
      options,
      loading
    }
  };
};

export default connect(mapStateToProps, actions)(Component);
