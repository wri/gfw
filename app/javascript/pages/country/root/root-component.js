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

import WIDGETS_CONFIG from 'pages/country/data/widgets-config.json';

import './root-styles.scss';

class Root extends PureComponent {
  render() {
    const {
      showMapMobile,
      handleShowMapMobile,
      links,
      isGeostoreLoading,
      setCategory,
      category,
      adminLevel
    } = this.props;

    return (
      <div className="l-country">
        <button className="open-map-mobile-tab" onClick={handleShowMapMobile}>
          <span>{!showMapMobile ? 'show' : 'close'} map</span>
        </button>
        <div className="panels">
          <div className="data-panel">
            <Header className="header" />
            <SubNavMenu
              links={links}
              activeLink={category}
              className="subnav-tabs"
              theme="theme-subnav-dark"
              handleClick={setCategory}
            />
            <div className="widgets">
              <div className="row">
                {Object.keys(WIDGETS_CONFIG).map(
                  widget =>
                    (WIDGETS_CONFIG[widget].config.categories.indexOf(category) >
                      -1 ||
                    WIDGETS_CONFIG[widget].config.admins.indexOf(adminLevel) >
                      -1 ? (
                        <div
                          key={widget}
                          className={`columns large-${
                            WIDGETS_CONFIG[widget].gridWidth
                          } small-12 widget`}
                        >
                          <Widget
                            widget={widget}
                            size={WIDGETS_CONFIG[widget].gridWidth}
                          />
                        </div>
                      ) : null)
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
  setCategory: PropTypes.func,
  category: PropTypes.string,
  adminLevel: PropTypes.string
};

export default Root;
