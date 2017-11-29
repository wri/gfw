import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ScrollEvent from 'react-onscroll';

import Widget from 'pages/country/widgets';
import Share from 'components/share';
import Header from 'pages/country/header';
import Footer from 'pages/country/footer';
import Map from 'pages/country/map';
import Stories from 'pages/country/widgets/widget-stories';

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
    const {
      isMapFixed,
      showMapMobile,
      handleShowMapMobile,
      handleScrollCallback,
      adminsLists,
      adminsSelected
    } = this.props;
    return (
      <div className="l-country">
        <ScrollEvent
          handleScrollCallback={() => handleScrollCallback(this.props)}
        />
        {isMapFixed && (
          <button className="open-map-mobile-tab" onClick={handleShowMapMobile}>
            <span>{!showMapMobile ? 'show' : 'close'} map</span>
          </button>
        )}
        <Header adminsLists={adminsLists} adminsSelected={adminsSelected} />
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
        <div className="l-country__widgets row">
          {adminsSelected &&
            Object.keys(WIDGETS).map(widget => (
              <div
                key={widget}
                className={`large-${
                  WIDGETS[widget].gridWidth
                } small-12 columns l-country__container-widgets`}
              >
                <Widget widget={widget} />
              </div>
            ))}
        </div>
        <Stories locationNames={adminsSelected} />
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
  adminsLists: PropTypes.object,
  adminsSelected: PropTypes.object
};

export default Root;
