import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ScrollEvent from 'react-onscroll';

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
    setInitialData(this.props);
  }

  componentWillUpdate(nextProps) {
    const { iso, refreshCountryData, checkLoadingStatus } = this.props;
    if (iso !== nextProps.iso) {
      refreshCountryData(nextProps);
    } else {
      checkLoadingStatus(nextProps);
    }
  }

  handleScrollCallback() {
   if (window.scrollY >= 59) {
     this.props.setPositionMap(true);
     this.props.setTopMap(0);
   }
   if(window.scrollY >= (document.getElementById('c-widget-stories').offsetTop - window.innerHeight)) {
     this.props.setPositionMap(false);
     this.props.setTopMap(document.getElementById('c-widget-stories').offsetTop - window.innerHeight);
   }
   if (window.scrollY < 59) {
     this.props.setPositionMap(false);
     this.props.setTopMap(59);
   }
 }

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return (
        <div className="c-loading">
          <div className="loader">Loading...</div>
        </div>)
    } else {
      return (
        <div>
          <ScrollEvent handleScrollCallback={() => this.handleScrollCallback()} />
          <Header />
          <div className={`l-country__map ${this.props.fixed ? '-fixed' : ''}`} style={{top: this.props.topMap}}>
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
              }} />
          </div>
          <div className="l-country__widgets row">
            <div className="large-6 small-12 columns l-country__container-widgets">
              <WidgetTreeCover />
            </div>
            <div className="large-6 small-12 columns l-country__container-widgets">
              <WidgetTreeLocated />
            </div>
            <div className="small-12 columns l-country__container-widgets">
              <WidgetTreeLoss />
            </div>
            <div className="small-12 columns l-country__container-widgets">
              <WidgetTreeCoverLossAreas />
            </div>
            <div className="large-6 small-12 columns l-country__container-widgets">
              <WidgetTreeCoverGain />
            </div>
            <div className="large-6 small-12 columns l-country__container-widgets">
              <WidgetAreasMostCoverGain />
            </div>
            <div className="large-6 small-12 columns l-country__container-widgets -last">
              <WidgetTotalAreaPlantations />
            </div>
            <div className="large-6 small-12 columns l-country__container-widgets -last">
              <WidgetPlantationArea />
            </div>
          </div>
          <WidgetStories />
          <Footer />
        </div>
      )
    }
  }
}

Root.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  iso: PropTypes.string.isRequired,
  countryRegion: PropTypes.number.isRequired,
  countryData: PropTypes.object.isRequired,
  countryRegions: PropTypes.array.isRequired,
  countriesList: PropTypes.array.isRequired,
  setInitialData: PropTypes.func.isRequired,
  refreshCountryData: PropTypes.func.isRequired,
  checkLoadingStatus: PropTypes.func.isRequired
};

export default Root;
