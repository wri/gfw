import { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import find from 'lodash/find';

import Icon from 'components/ui/icon';
import arrowDown from 'assets/icons/arrow-down.svg?sprite';

import Checkbox from 'components/ui/checkbox';

import './styles.scss';

// TODO: Move all this logic to rdx state

const DYNO_BASEMAPS = [
  { id: 'planet', label: 'Planet Satellite imagery', description: 'Monthly high resolution basemaps (tropics).' },
  { id: 'google_satellite', label: 'Google', description: 'Highest resolution imagery 1-3 years old (global).' },
  { id: 'landsat_8', label: 'Landsat 8', description: 'Coarse resolution imagery (global).' },
  { id: 'landsat_8_sentinel_2', label: 'Landsat 8 / Sentinel 2', description: 'Filter individual images by data and cloud cover (global).' }
]

const getActiveBasemap = (basemaps, id) => find(basemaps, { id });

const MapLegendBasemaps = ({ className, basemaps, ...props }) => {
  console.log('props', props);
  const [dynoActive, setDynoActive] = useState(false);
  const [activeDyno, setActiveDyno] = useState('planet');

  return (
    <div className={cx('c-map-legend-basemaps', className)}>
      <header className="header">
        <button
          className="show-dyno-basemap-btn"
          onClick={() => setDynoActive(!dynoActive)}
        >
          <Checkbox className="dyno-basemap-checkbox" value={dynoActive} />
        </button>
        <span className="active-basemap-title">{getActiveBasemap(DYNO_BASEMAPS, activeDyno).label}</span>
        <Icon icon={arrowDown} />
      </header>
      <section className="dyno-basemaps">
        <ul>
          {basemaps.map(basemap => {
            return (
              <li className="dyno-basemap">
                <img src={basemap.image} alt={basemap.label} className="dyno-basemap--thumbnail" />
                <span className="dyno-basemap--title">{basemap.label}</span>
                {basemap.description && <p className="dyno-basemap--description">{basemap.description}</p>}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  );
};

MapLegendBasemaps.propTypes = {
  className: PropTypes.string,
  basemaps: PropTypes.object
};

export default MapLegendBasemaps;
