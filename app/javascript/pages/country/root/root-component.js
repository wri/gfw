import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SCREEN_M } from 'utils/constants';

import Widget from 'pages/country/widget';
import Share from 'components/share';
import Header from 'pages/country/header';
import Footer from 'pages/country/footer';
import Map from 'components/map';
import Stories from 'pages/country/stories';
import Sticky from 'components/sticky';
import CountryDataProvider from 'pages/country/providers/country-data-provider';
import SubNavMenu from 'components/subnav-menu';
import NoContent from 'components/no-content';
import Loader from 'components/loader/loader';

import './root-styles.scss';

class Root extends PureComponent {
  render() {
    const {
      showMapMobile,
      handleShowMapMobile,
      links,
      isGeostoreLoading,
      widgets,
      location,
      currentLocation,
      locationOptions,
      locationNames,
      category,
      loading
    } = this.props;

    return (
      <div className="l-country">
        <button className="open-map-mobile-tab" onClick={handleShowMapMobile}>
          <span>{!showMapMobile ? 'show' : 'close'} map</span>
        </button>
        <div className="panels">
          <div className="data-panel">
            <Header
              className="header"
              location={location}
              locationOptions={locationOptions}
              locationNames={locationNames}
            />
            <SubNavMenu
              links={links}
              className="subnav-tabs"
              theme="theme-subnav-dark"
              checkActive
            />
            <div className="widgets">
              <div className="row">
                {loading && (
                  <div className="columns small-12">
                    <Loader className="widgets-loader" />
                  </div>
                )}
                {!loading &&
                  widgets &&
                  widgets.length > 0 &&
                  widgets.map(widget => (
                    <div
                      key={widget.name}
                      className={`columns large-${
                        widget.config.gridWidth
                      } small-12 widget`}
                    >
                      <Widget widget={widget.name} />
                    </div>
                  ))}
                {!loading &&
                  (!widgets || widgets.length === 0) && (
                    <div className="columns small-12">
                      <NoContent
                        className="no-widgets-message"
                        message={`No ${category} data available for ${currentLocation}`}
                        icon
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}>
            <Sticky
              className={`map ${showMapMobile ? '-open-mobile' : ''}`}
              limitElement="c-stories"
              enabled={window.innerWidth >= SCREEN_M}
            >
              <Map
                maxZoom={14}
                minZoom={3}
                mapOptions={{
                  mapTypeId: 'grayscale',
                  backgroundColor: '#99b3cc',
                  disableDefaultUI: true,
                  panControl: false,
                  zoomControl: false,
                  mapTypeControl: false,
                  scaleControl: true,
                  streetViewControl: false,
                  overviewMapControl: false,
                  tilt: 0,
                  scrollwheel: false,
                  center: { lat: -34.397, lng: 150.644 },
                  zoom: 8
                }}
                isParentLoading={isGeostoreLoading}
              />
            </Sticky>
          </div>
        </div>
        <Stories />
        <Footer />
        <Share />
        <CountryDataProvider />
      </div>
    );
  }
}

Root.propTypes = {
  showMapMobile: PropTypes.bool.isRequired,
  handleShowMapMobile: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  isGeostoreLoading: PropTypes.bool,
  widgets: PropTypes.array,
  location: PropTypes.object,
  loading: PropTypes.bool,
  currentLocation: PropTypes.string,
  category: PropTypes.string,
  locationOptions: PropTypes.object,
  locationNames: PropTypes.object
};

export default Root;
