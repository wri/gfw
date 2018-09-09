import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import upperFirst from 'lodash/upperFirst';

import { DASHBOARDS } from 'router';
import { deburrUpper } from 'utils/data';

import shareActions from 'components/modals/share/share-actions';
import { getAdminsSelected, getSentence } from './header-selectors';
import * as ownActions from './header-actions';
import reducers, { initialState } from './header-reducers';
import HeaderComponent from './header-component';

const actions = { ...ownActions, ...shareActions };

const mapStateToProps = (
  { countryData, header, widgets },
  { location, query }
) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading
  } = countryData;
  const { country } = location;
  const countryDataLoading =
    isCountriesLoading || isRegionsLoading || isSubRegionsLoading;
  const externalLinks =
    countryData.countryLinks && countryData.countryLinks[country];
  const forestAtlasLink =
    externalLinks &&
    externalLinks.find(l =>
      deburrUpper(l.title).indexOf(deburrUpper('forest atlas'))
    );
  const downloadLink = `http://gfw2-data.s3.amazonaws.com/country/umd_country_stats${
    country ? '/iso' : ''
  }/tree_cover_stats_2017${country ? `_${country}` : ''}.xlsx`;
  const locationOptions = { ...countryData };
  const locationNames = getAdminsSelected({ ...countryData, location });

  return {
    ...header,
    loading: countryDataLoading || header.loading,
    downloadLink,
    forestAtlasLink,
    externalLinks,
    locationNames,
    locationOptions,
    shareData: {
      title: 'Share this Dashboard',
      shareUrl: `${window.location.href}`,
      socialText: `${(locationNames &&
        locationNames.country &&
        `${locationNames.country.label}'s`) ||
        upperFirst(location.type)} dashboard`
    },
    widgets,
    sentence: getSentence({ locationNames, ...header }),
    location,
    query
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { query, widgets } = ownProps;
  const widgetQueries = {};
  if (query) {
    Object.keys(query).forEach(key => {
      if (widgets.map(w => w.name).indexOf(key) > -1) {
        const widget = widgets.find(w => w.name === key);
        if (widget.settings) {
          const { forestType, landCategory, page } = widget.settings;
          widgetQueries[key] = {
            ...query[key],
            forestType: forestType || '',
            landCategory: landCategory || '',
            ...(!!(page === 0) && { page: 0 })
          };
        }
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
        type: DASHBOARDS,
        payload: {
          type: country ? 'country' : 'global',
          country: country && country.value,
          region: undefined,
          subRegion: undefined
        },
        query: newQuery
      }),
      handleRegionChange: (country, region) => ({
        type: DASHBOARDS,
        payload: {
          type: 'country',
          country: country.value,
          ...(!!region && region.value && { region: region.value }),
          subRegion: undefined
        },
        query: newQuery
      }),
      handleSubRegionChange: (country, region, subRegion) => ({
        type: DASHBOARDS,
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
  componentWillMount() {
    const { location, settings, getHeaderData } = this.props;
    getHeaderData({ ...location, ...settings });
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings, getHeaderData } = nextProps;
    if (!isEqual(location, this.props.location)) {
      getHeaderData({ ...location, ...settings });
    }
  }

  render() {
    return createElement(HeaderComponent, {
      ...this.props
    });
  }
}

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getHeaderData: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
