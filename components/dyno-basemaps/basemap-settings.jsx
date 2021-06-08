import PropTypes from 'prop-types';

import PlanetMenu from './settings/planet-menu';

const BasemapSettings = ({ basemap, setMapBasemap }) => {
  return (
    <section className="dyno-basemap-settings">
      {basemap.value === 'planet' && (
        <PlanetMenu setMapBasemap={setMapBasemap} />
      )}
    </section>
  );
};

BasemapSettings.propTypes = {
  basemap: PropTypes.object,
  setMapBasemap: PropTypes.func,
};

export default BasemapSettings;
