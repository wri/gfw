import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ScrollEvent from 'react-onscroll';

import Widget from 'pages/country/widgets';
import Share from 'components/share';
import Header from 'pages/country/header';
import Footer from 'pages/country/footer';
import Map from 'pages/country/map';

const WIDGETS = [
  'tree-cover',
  'tree-located',
  'tree-loss',
  'tree-cover-loss-areas',
  'tree-cover-gain',
  'total-area-plantations',
  'plantation-area',
  'stories'
];
class Root extends PureComponent {
  getWidgets = () => {
    const { isRootLoading } = this.props;
    return WIDGETS.map(widget => (
      <div
        key={widget}
        className="large-6 small-12 columns l-country__container-widgets"
      >
        <Widget
          widget={widget}
          locationNames={{ type: 'test' }}
          isRootLoading={isRootLoading}
        />
      </div>
    ));
  };

  render() {
    const {
      isMapFixed,
      showMapMobile,
      handleShowMapMobile,
      handleScrollCallback
    } = this.props;

    return (
      <div className="l-country">
        <ScrollEvent handleScrollCallback={handleScrollCallback} />
        {isMapFixed && (
          <button className="open-map-mobile-tab" onClick={handleShowMapMobile}>
            <span>{!showMapMobile ? 'show' : 'close'} map</span>
          </button>
        )}
        <Header />
        <div
          className={`l-country__map ${isMapFixed ? '-fixed' : ''} ${
            showMapMobile ? '-open-mobile' : ''
          }`}
          style={{ top: this.props.mapTop }}
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
              scrollwheel: false
            }}
          />
        </div>
        <div className="l-country__widgets row">{this.getWidgets()}</div>
        <Footer />
        <Share />
      </div>
    );
  }
}

Root.propTypes = {
  showMapMobile: PropTypes.bool.isRequired,
  handleScrollCallback: PropTypes.func.isRequired,
  isMapFixed: PropTypes.bool.isRequired,
  mapTop: PropTypes.number.isRequired,
  handleShowMapMobile: PropTypes.func.isRequired,
  isRootLoading: PropTypes.bool
};

export default Root;
