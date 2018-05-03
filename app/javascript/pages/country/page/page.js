import { connect } from 'react-redux';
import replace from 'lodash/replace';

import CATEGORIES from 'data/categories.json';

import mapActions from 'components/map/map-actions';

import { getLinks, getAdminsSelected } from './page-selectors';
import Component from './page-component';

const actions = { ...mapActions };

const mapStateToProps = ({
  countryData,
  whitelists,
  location,
  map,
  widgets
}) => {
  const category = (location.query && location.query.category) || 'summary';
  const { countryWhitelistLoading, regionWhitelistLoading } = whitelists;
  const adminData = {
    ...countryData,
    ...location
  };
  const { query } = location;
  const locationNames = getAdminsSelected(adminData);
  const locationOptions = { ...countryData };
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  const widgetAnchor = document.getElementById(widgetHash);
  const activeWidget = query && query.widget;

  return {
    showMapMobile: map.showMapMobile,
    links: getLinks({ categories: CATEGORIES, ...location, category }),
    isGeostoreLoading: countryData.isGeostoreLoading,
    category,
    ...location,
    widgetAnchor,
    ...countryData,
    locationNames,
    locationOptions,
    activeWidget: widgets[activeWidget],
    currentLocation:
      locationNames && locationNames.current && locationNames.current.label,
    locationGeoJson: countryData.geostore && countryData.geostore.geojson,
    loading: countryWhitelistLoading || regionWhitelistLoading
  };
};

export default connect(mapStateToProps, actions)(Component);
