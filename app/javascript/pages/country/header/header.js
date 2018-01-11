import { bindActionCreators } from 'redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';
import { format } from 'd3-format';

import * as actions from './header-actions';
import reducers, { initialState } from './header-reducers';

import HeaderComponent from './header-component';

const mapStateToProps = ({ countryData, location, header }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  const {
    isExtentLoading,
    isPlantationsLossLoading,
    isTotalLossLoading
  } = header;
  const countryDataLoading =
    isCountriesLoading || isRegionsLoading || isSubRegionsLoading;
  const headerDataLoading =
    isExtentLoading || isPlantationsLossLoading || isTotalLossLoading;
  return {
    isLoading: countryDataLoading || headerDataLoading,
    settings: header.settings,
    location: location.payload,
    query: location.query,
    data: header.data
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { query } = ownProps.location;
  const widgetQueries = {};
  if (query) {
    const widgetKeys = remove(Object.keys(query), d => d !== 'category');
    widgetKeys.forEach(key => {
      widgetQueries[key] = encodeStateForUrl({
        ...decodeUrlForState(query[key]),
        indicator: 'gadm28'
      });
    });
  }
  const newQuery = {
    ...query,
    ...widgetQueries
  };

  return bindActionCreators(
    {
      handleCountryChange: country => ({
        type: COUNTRY,
        payload: { country: country.value },
        query: newQuery
      }),
      handleRegionChange: (country, region) => ({
        type: COUNTRY,
        payload: { country: country.value, region: region.value },
        query: newQuery
      }),
      handleSubRegionChange: (country, region, subRegion) => ({
        type: COUNTRY,
        payload: {
          country: country.value,
          region: region.value,
          subRegion: subRegion.value
        },
        query: newQuery
      }),
      ...actions
    },
    dispatch
  );
};

class HeaderContainer extends PureComponent {
  componentDidMount() {
    const {
      location,
      settings,
      getTotalExtent,
      getTotalLoss,
      getPlantationsLoss
    } = this.props;
    getTotalExtent({ ...location, ...settings });
    getTotalLoss({ ...location, ...settings });
    getPlantationsLoss({ ...location, ...settings, indicator: 'plantations' });
    if (location.region) {
      getTotalExtent({ ...location, ...settings });
    }
    if (location.subRegion) {
      getTotalExtent({ ...location, ...settings });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings } = nextProps;
    const { getTotalExtent, getTotalLoss, getPlantationsLoss } = this.props;

    if (!isEqual(location, this.props.location)) {
      getTotalExtent({ ...nextProps.location, ...settings });
      getTotalLoss({ ...nextProps.location, ...settings });
      getPlantationsLoss({
        ...nextProps.location,
        ...settings,
        indicator: 'plantations'
      });
    }
  }

  getHeaderDescription = () => {
    const { locationNames, data } = this.props;
    const extent = format('.2s')(data.extent);
    const percentageCover = format('.1f')(data.extent / data.totalArea * 100);
    const lossWithOutPlantations = format('.2s')(
      data.totalLoss.area - (data.plantationsLoss.area || 0)
    );
    const emissionsWithoutPlantations = format('.2s')(
      data.totalLoss.emissions - (data.plantationsLoss.emissions || 0)
    );
    const location = locationNames.current && locationNames.current.label;
    let firstSentence = '';
    let secondSentence = '';
    if (data.extent > 0) {
      firstSentence = `
        In 2010, <b>${location}</b> had <b>${extent}ha</b> of tree cover, extending over <b>${percentageCover}%</b> of its land area.
      `;
    } else {
      firstSentence = `
        In 2010, <b>${location}</b> had no tree cover.
      `;
    }
    if (data.extent > 0 && data.totalLoss.area) {
      secondSentence = `
        In ${
          data.totalLoss.year
        }, it lost <b>${lossWithOutPlantations}ha</b> of forest${
          data.plantationsLoss.area ? ' excluding tree plantations' : ''
        }, equivalent to <b>${emissionsWithoutPlantations}tonnes</b> of CO₂ of emissions.
      `;
    }
    return `${firstSentence} ${secondSentence}`;
  };

  render() {
    return createElement(HeaderComponent, {
      ...this.props,
      getHeaderDescription: this.getHeaderDescription
    });
  }
}

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  getTotalExtent: PropTypes.func.isRequired,
  getTotalLoss: PropTypes.func.isRequired,
  getPlantationsLoss: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
