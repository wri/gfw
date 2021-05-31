import PropTypes from 'prop-types';

import PlanetMenu from './settings/planet-menu';

const BasemapSettings = ({ basemap }) => {
  return (
    <section className="dyno-basemap-settings">
      {basemap.value === 'planet' && <PlanetMenu />}
    </section>
  )
}

BasemapSettings.propTypes = {
  basemap: PropTypes.object,
};

export default BasemapSettings;