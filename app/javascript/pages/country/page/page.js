import { connect } from 'react-redux';
import replace from 'lodash/replace';

import {
  getActiveAdmin,
  getAdminsOptions,
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
    waterBodiesWhitelist,
    countryWhitelistLoading,
    regionWhitelistLoading,
    waterBodiesWhitelistLoading
  } = whitelists;
  const adminData = {
    ...countryData,
    ...location,
    waterBodies: waterBodiesWhitelist
  };
  const locationOptions = getAdminsOptions(adminData);
  const locationNames = getAdminsSelected(adminData);
  const adminLevel = getActiveAdmin(adminData);
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  const widgetAnchor = document.getElementById(widgetHash);
  const activeWidget =
    replace(window.location.hash, '#', '') ||
    (location.query && location.query.widget);
  const widgetData = {
    faoCountries: countryData.faoCountries,
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
    locationOptions,
    locationNames,
    currentLocation:
      locationNames[adminLevel] && locationNames[adminLevel].label,
    widgets: filteredWidgets,
    locationGeoJson: countryData.geostore && countryData.geostore.geojson,
    loading:
      countryWhitelistLoading ||
      regionWhitelistLoading ||
      waterBodiesWhitelistLoading,
    activeWidget:
      widgets[activeWidget] || (!!filteredWidgets.length && filteredWidgets[0])
  };
};

export default connect(mapStateToProps, actions)(Component);
