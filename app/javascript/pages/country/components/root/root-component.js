import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ScrollEvent from 'react-onscroll';

import Loader from '../../../../common/components/loader/loader';
import Header from '../header/header';
import Footer from '../footer/footer';
import Map from '../map/map';
import WidgetTreeCover from '../widget-tree-cover/widget-tree-cover';
import WidgetTreeLocated from '../widget-tree-located/widget-tree-located';
import WidgetTreeLoss from '../widget-tree-loss/widget-tree-loss';
import WidgetTreeCoverLossAreas from '../widget-tree-cover-loss-areas/widget-tree-cover-loss-areas';
import WidgetAreasMostCoverGain from '../widget-areas-most-cover-gain/widget-areas-most-cover-gain';
import WidgetTotalAreaPlantations from '../widget-total-area-plantations/widget-total-area-plantations';
import WidgetTreeCoverGain from '../widget-tree-cover-gain/widget-tree-cover-gain';
import WidgetPlantationArea from '../widget-plantation-area/widget-plantation-area';
import WidgetStories from '../widget-stories/widget-stories';

class Root extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData();
  }

  componentWillUpdate(nextProps) {
    const { iso, refreshCountryData } = this.props;

    if (iso !== nextProps.iso && iso !== '') {
      refreshCountryData(nextProps);
    }
  }

  showMapMobile() {
    this.props.setShowMapMobile(!this.props.showMapMobile);
  }

  handleScrollCallback() {
    const {
      gfwHeaderHeight,
      isMapFixed,
      setFixedMapStatus,
      setMapTop
    } = this.props;

    const mapFixedLimit =
      document.getElementById('c-widget-stories').offsetTop -
      window.innerHeight;

    if (
      !isMapFixed &&
      window.scrollY >= gfwHeaderHeight &&
      window.scrollY < mapFixedLimit
    ) {
      setFixedMapStatus(true);
      setMapTop(0);
    } else if (isMapFixed && window.scrollY >= mapFixedLimit) {
      setFixedMapStatus(false);
      setMapTop(mapFixedLimit);
    }
  }

  render() {
    const { isLoading, countryRegion, isMapFixed, showMapMobile } = this.props;
    const regionSelected = countryRegion === 0;

    if (isLoading) {
      return <Loader parentClass="l-country" />;
    }

    return (
      <div className="l-country">
        <ScrollEvent handleScrollCallback={() => this.handleScrollCallback()} />
        {isMapFixed && (
          <button
            className="open-map-mobile-tab"
            onClick={() => this.showMapMobile()}
          >
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
        <div className="l-country__widgets row">
          <div className="large-6 small-12 columns l-country__container-widgets">
            <WidgetTreeCover />
          </div>
          {regionSelected && (
            <div className="large-6 small-12 columns l-country__container-widgets">
              <WidgetTreeLocated />
            </div>
          )}
          <div
            className={`${
              !regionSelected ? 'large-6 small-12' : 'small-12'
            } columns l-country__container-widgets `}
          >
            <WidgetTreeLoss />
          </div>
          {regionSelected && (
            <div className="small-12 columns l-country__container-widgets">
              <WidgetTreeCoverLossAreas />
            </div>
          )}
          <div className="large-6 small-12 columns l-country__container-widgets">
            <WidgetTreeCoverGain />
          </div>
          {regionSelected && (
            <div className="large-6 small-12 columns l-country__container-widgets">
              <WidgetAreasMostCoverGain />
            </div>
          )}
          <div className="large-6 small-12 columns l-country__container-widgets -last">
            <WidgetTotalAreaPlantations />
          </div>
          {regionSelected && (
            <div className="large-6 small-12 columns l-country__container-widgets -last">
              <WidgetPlantationArea />
            </div>
          )}
        </div>
        <WidgetStories />
        <Footer />
      </div>
    );
  }
}

Root.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  iso: PropTypes.string.isRequired,
  countryRegion: PropTypes.number.isRequired,
  gfwHeaderHeight: PropTypes.number.isRequired,
  setInitialData: PropTypes.func.isRequired,
  refreshCountryData: PropTypes.func.isRequired,
  setShowMapMobile: PropTypes.func.isRequired,
  showMapMobile: PropTypes.bool.isRequired,
  setFixedMapStatus: PropTypes.func.isRequired,
  setMapTop: PropTypes.func.isRequired,
  isMapFixed: PropTypes.bool.isRequired,
  mapTop: PropTypes.number.isRequired
};

export default Root;
