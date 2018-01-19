import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getActiveAdmin,
  getAdminsOptions,
  getAdminsSelected
} from 'pages/country/widget/widget-selectors';
import CATEGORIES from 'pages/country/data/categories.json';

import actions from './root-actions';
import reducers, { initialState } from './root-reducers';
import { filterWidgets, getLinks } from './root-selectors';
import RootComponent from './root-component';

const mapStateToProps = ({ root, countryData, location }) => {
  const category = (location.query && location.query.category) || 'summary';
  const adminData = {
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions,
    location: location.payload
  };
  const locationOptions = getAdminsOptions(adminData);
  const locationNames = getAdminsSelected(adminData);
  const adminLevel = getActiveAdmin(location.payload);
  const widgetAnchor = window.location.hash
    ? document.querySelectorAll(window.location.hash)
    : null;
  const {
    regionWhitelist,
    countryWhitelist,
    isCountryWhitelistLoading,
    isRegionWhitelistLoading
  } = countryData;
  return {
    gfwHeaderHeight: root.gfwHeaderHeight,
    isMapFixed: root.isMapFixed,
    showMapMobile: root.showMapMobile,
    links: getLinks({ categories: CATEGORIES, location, category }),
    isGeostoreLoading: countryData.isGeostoreLoading,
    category,
    location,
    widgetAnchor: widgetAnchor && widgetAnchor[0],
    locationOptions,
    locationNames,
    currentLocation:
      locationNames[adminLevel] && locationNames[adminLevel].label,
    widgets: filterWidgets({
      faoCountries: countryData.faoCountries,
      category,
      adminLevel,
      location,
      locationOptions,
      indicatorWhitelist: location.payload.region
        ? regionWhitelist
        : countryWhitelist
    }),
    loading: isCountryWhitelistLoading || isRegionWhitelistLoading
  };
};

class RootContainer extends PureComponent {
  handleShowMapMobile = () => {
    this.props.setShowMapMobile(!this.props.showMapMobile);
  };

  render() {
    return createElement(RootComponent, {
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
