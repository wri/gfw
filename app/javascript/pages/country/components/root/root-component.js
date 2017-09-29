import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

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

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return <div className="c-loading">loading!</div>
    } else {
      return (
        <div>
          <Header />
          <div className="l-country__map">
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
            <div className="small-12 columns l-country__container-widgets">
              <WidgetTreeCoverGain />
            </div>
            <div className="small-12 columns l-country__container-widgets">
              <WidgetAreasMostCoverGain />
            </div>
            <div className="small-12 columns l-country__container-widgets -last">
              <WidgetTotalAreaPlantations />
            </div>
            <div className="small-12 columns l-country__container-widgets -last">
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
