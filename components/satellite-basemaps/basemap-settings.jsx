import PropTypes from 'prop-types';

import RecentImagerySettings from 'components/recent-imagery/components/recent-imagery-settings';

import PlanetMenu from './settings/planet-menu';
import LandsatMenu from './settings/landsat-menu';

const BasemapSettings = ({ basemap, setMapBasemap }) => {
  return (
    <section className="satellite-basemap-settings">
      {basemap.value === 'planet' && (
        <PlanetMenu setMapBasemap={setMapBasemap} />
      )}
      {basemap.value === 'landsat' && (
        <LandsatMenu setMapBasemap={setMapBasemap} />
      )}
      {basemap.value === 'recentImagery' && <RecentImagerySettings active />}
    </section>
  );
};

BasemapSettings.propTypes = {
  basemap: PropTypes.object,
  setMapBasemap: PropTypes.func,
};

export default BasemapSettings;
