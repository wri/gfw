import { connect } from 'react-redux';
import replace from 'lodash/replace';

import {
  getActiveAdmin,
  getAdminsOptions,
  getAdminsSelected
} from 'components/widget/widget-selectors';
import CATEGORIES from 'data/categories.json';

import mapActions from 'components/map/map-actions';
import { filterWidgets, getLinks, getActiveWidget } from './page-selectors';
import Component from './page-component';

const actions = { ...mapActions };

const mapStateToProps = ({ countryData, whitelists, location, map }) => {
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
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions,
    waterBodies: waterBodiesWhitelist,
    location: location.payload
  };
  const locationOptions = getAdminsOptions(adminData);
  const locationNames = getAdminsSelected(adminData);
  const adminLevel = getActiveAdmin(location.payload);
  const widgetHash =
    window.location.hash && replace(window.location.hash, '#', '');
  const widgetAnchor = document.getElementById(widgetHash);
  const widgetData = {
    faoCountries: countryData.faoCountries,
    category,
    adminLevel,
    location,
    locationOptions,
    activeWidget:
      replace(window.location.hash, '#', '') ||
      (location.query && location.query.widget),
    indicatorWhitelist: location.payload.region
      ? regionWhitelist
      : countryWhitelist
  };

  return {
    showMapMobile: map.showMapMobile,
    links: getLinks({ categories: CATEGORIES, location, category }),
    isGeostoreLoading: countryData.isGeostoreLoading,
    category,
    location,
    widgetAnchor,
    locationOptions,
    locationNames,
    currentLocation:
      locationNames[adminLevel] && locationNames[adminLevel].label,
    widgets: filterWidgets(widgetData),
    locationGeoJson: countryData.geostore && countryData.geostore.geojson,
    loading:
      countryWhitelistLoading ||
      regionWhitelistLoading ||
      waterBodiesWhitelistLoading,
    activeWidget: getActiveWidget(widgetData)
  };
};

export default connect(mapStateToProps, actions)(Component);
