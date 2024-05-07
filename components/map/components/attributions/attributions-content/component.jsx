import { PropTypes } from 'prop-types';
import { useMemo } from 'react';

import Icon from 'components/ui/icon';

import mapboxLogo from 'assets/logos/mapbox.svg?sprite';
import geeLogo from 'assets/logos/gee.png';
import cartoLogo from 'assets/logos/carto.png';
import planetLogo from 'assets/logos/planet.png';

const AttributionsContent = ({ isDesktop = false, isModal = false }) => {
  const currentYear = useMemo(() => new Date().getFullYear());

  return (
    <>
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
          <img
            className="ee-logo"
            src={geeLogo}
            alt="google earth engine"
            width="115"
          />
        </a>
        <a href="https://carto.com/" rel="noopener noreferrer" target="_blank">
          <img className="carto-logo" src={cartoLogo} alt="carto" width="60" />
        </a>
        <a
          href="https://www.planet.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            className="planet-logo"
            src={planetLogo}
            alt="planet"
            width="80"
          />
        </a>
      </div>
      <div className="links">
        <span>Map data ©{currentYear} Google</span>
        <a
          href="https://www.mapbox.com/about/maps/"
          rel="noopener noreferrer"
          target="_blank"
        >
          © Mapbox
        </a>
        <a
          href="http://www.openstreetmap.org/copyright"
          rel="noopener noreferrer"
          target="_blank"
        >
          © OpenStreetMap
        </a>
        <a
          href="https://www.mapbox.com/map-feedback/"
          rel="noopener noreferrer"
          target="_blank"
        >
          Improve this map
        </a>
        {(isDesktop || isModal) && (
          <>
            <a
              href="https://www.wri.org/about/wri-data-platforms-tos"
              rel="noopener noreferrer"
              target="_blank"
            >
              Terms of Service
            </a>
            <a href="/privacy-policy" rel="noopener noreferrer" target="_blank">
              Privacy policy
            </a>
          </>
        )}
      </div>
    </>
  );
};

AttributionsContent.propTypes = {
  isDesktop: PropTypes.bool,
  isModal: PropTypes.bool,
};

export default AttributionsContent;
