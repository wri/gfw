import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';

import mapboxLogo from 'assets/logos/mapbox-logo-white.svg';
import geeLogo from 'assets/logos/gee.png';
import cartoLogo from 'assets/logos/carto.png';

import './styles.scss';

class MapAttributions extends PureComponent {
  render() {
    const { className } = this.props;
    return (
      <div className={`c-map-attributions ${className || ''}`}>
        <a
          href="https://www.mapbox.com/about/maps/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon className="mapbox-logo" icon={mapboxLogo} />
        </a>
        <a
          href="https://earthengine.google.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={geeLogo} alt="google earth engine" width="115" />
        </a>
        <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">
          <img src={cartoLogo} alt="carto" width="60" />
        </a>
        <span>Map data ©2016 Google, INEGI</span>
        <a href="/terms" rel="noopener noreferrer" target="_blank">
          Terms of use
        </a>
        <a href="/privacy-policy" rel="noopener noreferrer" target="_blank">
          Privacy policy
        </a>
      </div>
    );
  }
}

MapAttributions.propTypes = {
  className: PropTypes.string
};

export default MapAttributions;
