import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom'

import Header from '../header/header';
import Map from '../map/map';

class Root extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  componentWillUpdate(nextProps) {
    const { iso, refreshCountryData, checkLoadingStatus } = this.props;
    if (iso !== nextProps.iso) {
      console.log('refreshCountryData');
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
          <div className="c-map-container">
            <Map
              zoom={4}
              center={{latitude: 0, longitude: 20}}
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
        </div>
      )
    }
  }
}

Root.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  iso: PropTypes.string.isRequired,
  region: PropTypes.number.isRequired,
  countryData: PropTypes.object.isRequired,
  countryRegions: PropTypes.array.isRequired,
  countriesList: PropTypes.array.isRequired,
  setInitialData: PropTypes.func.isRequired,
  refreshCountryData: PropTypes.func.isRequired,
  checkLoadingStatus: PropTypes.func.isRequired
};

export default Root;
