import { connect } from 'react-redux';
import replace from 'lodash/replace';

import {
  getActiveAdmin,
  getAdminsSelected
} from 'components/widget/widget-selectors';
import CATEGORIES from 'data/categories.json';

import mapActions from 'components/map/map-actions';
import { filterWidgets, getLinks } from './page-selectors';
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
  const {
    countryWhitelist,
    regionWhitelist,
    countryWhitelistLoading,
    regionWhitelistLoading
  } = whitelists;
  const adminData = {
    ...countryData,
    ...location
  };
  const locationNames = getAdminsSelected(adminData);
  const locationOptions = { ...countryData };
  const adminLevel = getActiveAdmin(adminData);
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  const widgetAnchor = document.getElementById(widgetHash);
  const activeWidget =
    replace(window.location.hash, '#', '') ||
    (location.query && location.query.widget);
  const widgetData = {
    ...countryData,
    category,
    adminLevel,
    ...location,
    locationOptions,
    indicatorWhitelist: location.payload.region
      ? regionWhitelist
      : countryWhitelist
  };
  const filteredWidgets = filterWidgets(widgetData);

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
    currentLocation:
      locationNames[adminLevel] && locationNames[adminLevel].label,
    widgets: filteredWidgets,
    locationGeoJson: countryData.geostore && countryData.geostore.geojson,
    loading: countryWhitelistLoading || regionWhitelistLoading,
    activeWidget:
      widgets[activeWidget] || (filteredWidgets && filteredWidgets[0])
  };
};

export default connect(mapStateToProps, actions)(Component);
