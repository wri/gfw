import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import replace from 'lodash/replace';

import {
  getActiveAdmin,
  getAdminsOptions,
  getAdminsSelected
} from 'components/widget/widget-selectors';
import CATEGORIES from 'data/categories.json';

import mapActions from 'components/map/map-actions';
import ownActions from './page-actions';
import reducers, { initialState } from './page-reducers';
import { filterWidgets, getLinks, getActiveWidget } from './page-selectors';
import PageComponent from './page-component';

const actions = { ...ownActions, ...mapActions };

const mapStateToProps = ({ page, countryData, whitelists, location }) => {
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
    gfwHeaderHeight: page.gfwHeaderHeight,
    isMapFixed: page.isMapFixed,
    showMapMobile: page.showMapMobile,
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

class RootContainer extends PureComponent {
  handleShowMapMobile = () => {
    this.props.setShowMapMobile(!this.props.showMapMobile);
  };

  render() {
    return createElement(PageComponent, {
      ...this.props,
      handleShowMapMobile: this.handleShowMapMobile,
      handleScrollCallback: this.handleScrollCallback
    });
  }
}

RootContainer.propTypes = {
  setShowMapMobile: PropTypes.func,
  showMapMobile: PropTypes.bool
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(RootContainer);
