import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { routes } from 'pages/country/router';

import RootComponent from './root-component';
import actions from './root-actions';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

const mapStateToProps = ({ root, countryData }) => ({
  gfwHeaderHeight: root.gfwHeaderHeight,
  isMapFixed: root.isMapFixed,
  showMapMobile: root.showMapMobile,
  links: Object.values(routes)
    .filter(r => r.submenu)
    .map(r => ({ label: r.label, path: r.path })),
  isGeostoreLoading: countryData.isGeostoreLoading
});

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

export default connect(mapStateToProps, actions)(RootContainer);
