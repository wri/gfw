import { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import arrowDown from 'assets/icons/arrow-down.svg?sprite';
import infoIcon from 'assets/icons/info.svg?sprite';

import Checkbox from 'components/ui/checkbox';

import BasemapSettings from './basemap-settings';

import './styles.scss';

function handleTitle(basemap) {
  return (
    <>
      {basemap.label}
      {' '}
      {basemap.value !== 'recentImagery' ? 'SATELLITE IMAGERY' : ''}
      {' '}
      {basemap?.caveat && <span className="caveat">{basemap.caveat}</span>}
    </>
  );
}

const SatelliteBasemaps = ({
  className,
  planetPeriods,
  landsatYear,
  basemaps,
  activeBasemap,
  setMainMapSettings,
  setMapBasemap,
  setModalMetaSettings,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const handleToggleActive = () => {
    setOpen(!activeBasemap.active);
    setMapBasemap({
      value: activeBasemap.active ? 'default' : activeBasemap.value,
      ...(activeBasemap.value === 'planet' && {
        color: 'rgb',
        name: planetPeriods[planetPeriods.length - 1].value,
      }),
      ...(activeBasemap.value === 'landsat' && {
        year: landsatYear,
      }),
    });
    setMainMapSettings({
      showRecentImagery: activeBasemap.active
        ? false
        : activeBasemap.value === 'recentImagery',
    });
  };

  const handleSetSatelliteBasemap = (value) => {
    setMapBasemap({
      value,
      ...(value === 'planet' && {
        color: 'rgb',
        name: planetPeriods[planetPeriods.length - 1].value,
      }),
      ...(value === 'landsat' && {
        year: landsatYear,
      }),
    });
    setMainMapSettings({
      showRecentImagery: value === 'recentImagery',
    });
  };

  return (
    <div className={cx('c-map-legend-basemaps', className)}>
      <header className="header">
        <button
          className="show-satellite-basemap-btn"
          title={handleTitle(activeBasemap)}
          onClick={handleToggleActive}
        >
          <Checkbox
            className="satellite-basemap-checkbox"
            value={activeBasemap.active}
          />
        </button>
        <button
          className={cx('satellite-toggle-active', !open ? '-closed' : '-open')}
          onClick={toggleOpen}
          title={`${open ? 'Hide' : 'Show'} satellite basemaps`}
        >
          <span className="active-basemap-title">
            {handleTitle(activeBasemap)}
          </span>
          <Icon icon={arrowDown} />
        </button>
      </header>
      {open && (
        <section className="satellite-basemaps">
          <ul>
            {basemaps.map((basemap) => {
              return (
                <li
                  key={`satellite-basemap-${basemap.value}`}
                  className={cx(
                    'satellite-basemap',
                    activeBasemap &&
                      activeBasemap.value === basemap.value &&
                      activeBasemap.active
                      ? 'active'
                      : ''
                  )}
                >
                  <button
                    className="satellite-basemap--cta"
                    aria-label={`Activate ${basemap.label}`}
                    onClick={() => handleSetSatelliteBasemap(basemap.value)}
                  >
                    <img
                      src={basemap.image}
                      alt={basemap.label}
                      className="satellite-basemap--thumbnail"
                    />
                    <div className="satellite-basemap--content">
                      <span className="satellite-basemap--title">
                        {basemap.label}
                        {basemap.infoModal && (
                          <Button
                            className="info-btn"
                            theme="theme-button-tiny theme-button-grey-filled square"
                            onClick={() =>
                              setModalMetaSettings(basemap.infoModal)}
                          >
                            <Icon icon={infoIcon} />
                          </Button>
                        )}
                      </span>
                      {basemap.description && (
                        <p className="satellite-basemap--description">
                          {basemap.description}
                        </p>
                      )}
                    </div>
                  </button>
                  {activeBasemap &&
                    activeBasemap.active &&
                    activeBasemap.hasSettings &&
                    activeBasemap.value === basemap.value && (
                      <BasemapSettings
                        setMapBasemap={setMapBasemap}
                        basemap={activeBasemap}
                      />
                    )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
};

SatelliteBasemaps.propTypes = {
  className: PropTypes.string,
  planetPeriods: PropTypes.arrayOf(PropTypes.object),
  landsatYear: PropTypes.number.isRequired,
  setMainMapSettings: PropTypes.func.isRequired,
  setMapBasemap: PropTypes.func.isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.object),
  activeBasemap: PropTypes.object,
  setModalMetaSettings: PropTypes.func.isRequired,
};

export default SatelliteBasemaps;
