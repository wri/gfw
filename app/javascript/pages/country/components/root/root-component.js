import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'

import Header from '../header/header';
import Map from '../map/map';
import WidgetTreeCover from '../widget-tree-cover/widget-tree-cover';
import WidgetTreeLocated from '../widget-tree-located/widget-tree-located';
import WidgetTreeLoss from '../widget-tree-loss/widget-tree-loss';

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
      return <div>loading!</div>
    } else {
      return (
        <div>
          <Header />
          <div className="l-country__map">
            <Map
              maxZoom={14}
              minZoom={1}
              mapOptions={{
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
            <div className="small-4 columns">
              <WidgetTreeCover />
            </div>
            <div className="small-4 columns">
              <WidgetTreeLocated />
            </div>
            <div className="small-8 columns">
              <WidgetTreeLoss />
            </div>
          </div>
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
