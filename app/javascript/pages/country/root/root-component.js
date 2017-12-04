import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Widget from 'pages/country/widgets';
import Share from 'components/share';
import Header from 'pages/country/header';
import Tabs from 'pages/country/tabs';
import Footer from 'pages/country/footer';
import Map from 'components/map';
import Stories from 'pages/country/stories';
import Sticky from 'components/sticky';

import './root-styles.scss';

const WIDGETS = {
  treeCover: {
    gridWidth: 6
  },
  treeLocated: {
    gridWidth: 6
  },
  treeLoss: {
    gridWidth: 12
  },
  treeCoverLossAreas: {
    gridWidth: 6
  },
  treeCoverGain: {
    gridWidth: 6
  },
  totalAreaPlantations: {
    gridWidth: 6
  },
  plantationArea: {
    gridWidth: 6
  }
};
class Root extends PureComponent {
  render() {
    const { showMapMobile, handleShowMapMobile } = this.props;
    return (
      <div className="l-country">
        <button className="open-map-mobile-tab" onClick={handleShowMapMobile}>
          <span>{!showMapMobile ? 'show' : 'close'} map</span>
        </button>
        <div className="panels">
          <div className="data-panel">
            <Header className="header" />
            <Tabs />
            <div className="widgets">
              <div className="row">
                {Object.keys(WIDGETS).map(widget => (
                  <div
                    key={widget}
                    className={`columns large-${
                      WIDGETS[widget].gridWidth
                    } small-12 widget`}
                  >
                    <Widget widget={widget} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}>
            <Sticky
              className={`map ${showMapMobile ? '-open-mobile' : ''}`}
              limitElement="c-stories"
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
              />
            </Sticky>
          </div>
        </div>
        <Stories />
        <Footer />
        <Share />
      </div>
    );
  }
}

Root.propTypes = {
  showMapMobile: PropTypes.bool.isRequired,
  handleShowMapMobile: PropTypes.func.isRequired
};

export default Root;
