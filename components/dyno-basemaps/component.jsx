import { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from 'components/ui/icon';
import arrowDown from 'assets/icons/arrow-down.svg?sprite';

import Checkbox from 'components/ui/checkbox';

import BasemapSettings from './basemap-settings';

import './styles.scss';

const DynoBasemaps = ({ className, basemaps, activeBasemap, setMapSettings }) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const handleToggleActive = () => {
    setMapSettings({
      basemap: {
        value: activeBasemap.active ? 'default' : activeBasemap.value
      }
    })
  }

  const handleSetDynoBasemap = value => {
    setMapSettings({
      basemap: {
        value
      }
    })
  }

  return (
    <div className={cx('c-map-legend-basemaps', className)}>
      <header className="header">
        <button
          className="show-dyno-basemap-btn"
          title={`${activeBasemap.active ? 'Disable' : 'Enable'} ${activeBasemap.label} satellite imagery`}
          onClick={handleToggleActive}
        >
          <Checkbox className="dyno-basemap-checkbox" value={activeBasemap.active} />
        </button>
        <span className="active-basemap-title">
          {activeBasemap.label}
          {' '}
          SATELLITE IMAGERY
        </span>
        <button className={cx('dyno-toggle-active', !open ? '-closed' : '-open')} onClick={toggleOpen} title={`${open ? 'Hide' : 'Show'} basemaps`}>
          <Icon icon={arrowDown} />
        </button>
      </header>
      {open && (
        <section className="dyno-basemaps">
          <ul>
            {basemaps.map(basemap => {
              return (
                <li className={cx('dyno-basemap', activeBasemap && activeBasemap.value === basemap.value ? 'active' : '')}>
                  <button
                    className="dyno-basemap--cta"
                    aria-label={`Activate ${basemap.label}`}
                    onClick={() => handleSetDynoBasemap(basemap.value)}
                  >
                    <img src={basemap.image} alt={basemap.label} className="dyno-basemap--thumbnail" />
                    <div className="dyno-basemap--content">
                      <span className="dyno-basemap--title">{basemap.label}</span>
                      {basemap.description && <p className="dyno-basemap--description">{basemap.description}</p>}
                    </div>
                  </button>
                  {activeBasemap && activeBasemap.active && activeBasemap.value === basemap.value && (
                    <BasemapSettings basemap={activeBasemap} />
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  );
};

DynoBasemaps.propTypes = {
  className: PropTypes.string,
  setMapSettings: PropTypes.func.isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.object),
  activeBasemap: PropTypes.object
};

export default DynoBasemaps;
