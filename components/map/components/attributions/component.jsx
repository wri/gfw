import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button } from 'gfw-components';

import Icon from 'components/ui/icon';

import mapboxLogo from 'assets/logos/mapbox.svg?sprite';
import geeLogo from 'assets/logos/gee.png';
import cartoLogo from 'assets/logos/carto.png';
import infoIcon from 'assets/icons/info.svg?sprite';
import planetLogo from 'assets/logos/planet.png';

import AttributionsModal from './attributions-modal';

import './styles.scss';

const MapAttributions = ({ className, viewport, map }) => {
  const width = map._container.clientWidth;
  const [open, setAttributionsModalOpen] = useState(false);
  const [narrowView, setNarrowView] = useState(width < 900);

  useEffect(() => {
    setNarrowView(width < 900);
  }, [viewport]);

  return (
    <div className={cx('c-map-attributions', className)}>
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
        <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">
          <img src={cartoLogo} alt="carto" width="60" />
        </a>
        <a
          href="https://www.planet.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img src={planetLogo} alt="planet" width="60" />
        </a>
      </div>
      {!narrowView && (
        <>
          <span>Map data ©2016 Google, INEGI</span>
          <a href="/terms" rel="noopener noreferrer" target="_blank">
            Terms of use
          </a>
          <a href="/privacy-policy" rel="noopener noreferrer" target="_blank">
            Privacy policy
          </a>
        </>
      )}
      {narrowView && (
        <>
          <Button
            className="attribution-btn"
            size="small"
            round
            dark
            onClick={() => setAttributionsModalOpen(true)}
          >
            <Icon icon={infoIcon} />
          </Button>
          <AttributionsModal
            open={open}
            onRequestClose={() => setAttributionsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

MapAttributions.propTypes = {
  className: PropTypes.string,
  map: PropTypes.object,
  viewport: PropTypes.object,
};

export default MapAttributions;
