import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { COUNTRY } from 'pages/dashboards/router';
import { deburrUpper } from 'utils/data';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

import shareActions from 'components/modals/share/share-actions';
import { getAdminsSelected, getSentence } from './header-selectors';
import * as ownActions from './header-actions';
import reducers, { initialState } from './header-reducers';
import HeaderComponent from './header-component';

const actions = { ...ownActions, ...shareActions };

const mapStateToProps = ({ countryData, location, header, widgets, cache }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  const { country } = location.payload;
  const countryDataLoading =
    isCountriesLoading || isRegionsLoading || isSubRegionsLoading;
  const externalLinks =
    countryData.countryLinks && countryData.countryLinks[country];
  const forestAtlasLink =
    externalLinks &&
    externalLinks.find(l =>
      deburrUpper(l.title).indexOf(deburrUpper('forest atlas'))
    );
  const locationOptions = { ...countryData };
  const locationNames = getAdminsSelected({ ...countryData, ...location });
  const cacheLoading = cache.cacheListLoading;

  return {
    ...header,
    loading: countryDataLoading || header.loading,
    cacheLoading,
    forestAtlasLink,
    externalLinks,
    locationNames,
    locationOptions,
    shareData: {
      title: 'Share this Dashboard',
      shareUrl: `${window.location.href}`
    },
    widgets,
    sentence: getSentence({ locationNames, ...header }),
    ...location
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { query, widgets } = ownProps;
  const widgetQueries = {};
  if (query) {
    Object.keys(query).forEach(key => {
      if (widgets.map(w => w.name).indexOf(key) > -1) {
        const widget = widgets.find(w => w.name === key);
        widgetQueries[key] = encodeStateForUrl({
          ...decodeUrlForState(query[key]),
          forestType: widget.settings.forestType || '',
          landCategory: widget.settings.landCategory || ''
        });
      }
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
        payload: {
          type: country ? 'country' : 'global',
          country: country && country.value,
          region: undefined,
          subRegion: undefined
        },
        query: newQuery
      }),
      handleRegionChange: (country, region) => ({
        type: COUNTRY,
        payload: {
          type: 'country',
          country: country.value,
          ...(!!region && region.value && { region: region.value }),
          subRegion: undefined
        },
        query: newQuery
      }),
      handleSubRegionChange: (country, region, subRegion) => ({
        type: COUNTRY,
        payload: {
          type: 'country',
          country: country.value,
          region: region.value,
          ...(!!subRegion && subRegion.value && { subRegion: subRegion.value })
        },
        query: newQuery
      }),
      ...actions
    },
    dispatch
  );
};

class HeaderContainer extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { cacheLoading, payload, settings, getHeaderData } = nextProps;
    if (
      cacheLoading !== this.props.cacheLoading ||
      !isEqual(payload, this.props.payload)
    ) {
      getHeaderData({ ...payload, ...settings });
    }
  }

  render() {
    return createElement(HeaderComponent, {
      ...this.props
    });
  }
}

HeaderContainer.propTypes = {
  payload: PropTypes.object.isRequired,
  getHeaderData: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  cacheLoading: PropTypes.bool
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
