import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import googleLogo from 'assets/logos/google.png';
import geeLogo from 'assets/logos/gee.png';
import cartoLogo from 'assets/logos/carto.png';

import './styles.scss';

class MapAttributions extends PureComponent {
  render() {
    const { className } = this.props;
    return (
      <div className={`c-map-attributions ${className || ''}`}>
        <a
          href="https://www.google.com/maps/@15,-2.970703,3z?hl=es"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={googleLogo} alt="google" width="55" />
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
      </div>
    );
  }
}

MapAttributions.propTypes = {
  className: PropTypes.string
};

export default MapAttributions;
