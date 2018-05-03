import { connect } from 'react-redux';
import replace from 'lodash/replace';

import {
  getActiveAdmin,
  getAdminsSelected
} from 'components/widgets/selectors';
import CATEGORIES from 'data/categories.json';

import mapActions from 'components/map/map-actions';
import { getLinks } from './page-selectors';
import Component from './page-component';

const actions = { ...mapActions };

const mapStateToProps = ({ countryData, whitelists, location, map }) => {
  const category = (location.query && location.query.category) || 'summary';
  const { countryWhitelistLoading, regionWhitelistLoading } = whitelists;
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
    locationGeoJson: countryData.geostore && countryData.geostore.geojson,
    loading: countryWhitelistLoading || regionWhitelistLoading
  };
};

export default connect(mapStateToProps, actions)(Component);
