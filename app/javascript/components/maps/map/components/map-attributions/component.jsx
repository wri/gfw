import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import ModalAttributions from 'components/modals/attributions';

import mapboxLogo from 'assets/logos/mapbox.svg';
import geeLogo from 'assets/logos/gee.png';
import cartoLogo from 'assets/logos/carto.png';
import infoIcon from 'assets/icons/info.svg';

import './styles.scss';

class MapAttributions extends PureComponent {
  render() {
    const { className, smallView, setModalAttributions } = this.props;
    return (
      <div className={`c-map-attributions ${className || ''}`}>
        <div className="logos">
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
          <a
            href="https://carto.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img src={cartoLogo} alt="carto" width="60" />
          </a>
        </div>
        {!smallView && (
          <Fragment>
            <span>Map data ©2016 Google, INEGI</span>
            <a href="/terms" rel="noopener noreferrer" target="_blank">
              Terms of use
            </a>
            <a href="/privacy-policy" rel="noopener noreferrer" target="_blank">
              Privacy policy
            </a>
          </Fragment>
        )}
        {smallView && (
          <Fragment>
            <Button
              className="attribution-info-btn"
              theme="theme-button-small square theme-button-grey-filled theme-button-xsmall"
              onClick={() => setModalAttributions(true)}
            >
              <Icon icon={infoIcon} />
            </Button>
            <ModalAttributions />
          </Fragment>
        )}
      </div>
    );
  }
}

MapAttributions.propTypes = {
  className: PropTypes.string,
  smallView: PropTypes.bool,
  setModalAttributions: PropTypes.func
};

export default MapAttributions;
