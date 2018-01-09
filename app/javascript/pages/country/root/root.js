import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getActiveAdmin,
  getAdminsOptions
} from 'pages/country/widget/widget-selectors';
import CATEGORIES from 'pages/country/data/categories.json';

import actions from './root-actions';
import reducers, { initialState } from './root-reducers';
import { getWidgets, getLinks } from './root-selectors';
import RootComponent from './root-component';

const mapStateToProps = ({ root, countryData, location }) => {
  const category = (location.query && location.query.category) || 'summary';
  const adminData = {
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  const locationOptions = getAdminsOptions({
    ...adminData,
    location: location.payload
  });
  return {
    gfwHeaderHeight: root.gfwHeaderHeight,
    isMapFixed: root.isMapFixed,
    showMapMobile: root.showMapMobile,
    links: getLinks({ categories: CATEGORIES, location, category }),
    isGeostoreLoading: countryData.isGeostoreLoading,
    category,
    location,
    widgets: getWidgets({
      category,
      adminLevel: getActiveAdmin(location.payload),
      locationOptions,
      indicatorWhitelist: countryData.whitelist
    }),
    loading: countryData.isWhitelistLoading
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
