import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import upperFirst from 'lodash/upperFirst';

import { trackEvent } from 'utils/analytics';

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
      <span>
        {basemap.label}
        {' '}
        {basemap?.caveat && <span className="caveat">{basemap.caveat}</span>}
      </span>
      {basemap.value === 'planet' &&
        basemap.active &&
        basemap?.planetPeriod?.period && (
          <span className="title-active-value">
            {basemap.planetPeriod.period}
          </span>
        )}
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
  isTropics,
}) => {
  const [open, setOpen] = useState(false);
  const [defaultSatSet, setDefaultSatSet] = useState(false);
  const toggleOpen = () => setOpen(!open);
  useEffect(() => {
    if (isTropics && !defaultSatSet) {
      setMapBasemap({
        value: 'planet',
        color: '',
        name: planetPeriods[planetPeriods.length - 1].value,
      });
      setDefaultSatSet(true);
      trackEvent({
        category: 'Map data',
        action: 'Basemap changed',
        label: 'Auto select planet isTropics',
      });
    }
  }, [isTropics, defaultSatSet]);

  const handleToggleActive = () => {
    setOpen(!activeBasemap.active);
    setMapBasemap({
      value: activeBasemap.active ? 'default' : activeBasemap.value,
      ...(activeBasemap.value === 'planet' && {
        color: '',
        name: planetPeriods[planetPeriods.length - 1].value,
        imageType: planetPeriods[planetPeriods.length - 1].imageType,
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
    trackEvent({
      category: 'Map data',
      action: 'Basemap changed',
      label: upperFirst(activeBasemap.value),
    });
  };

  const handleSetSatelliteBasemap = (e, value) => {
    e.stopPropagation();
    setMapBasemap({
      value,
      ...(value === 'planet' && {
        color: '',
        name: planetPeriods[planetPeriods.length - 1].value,
        imageType: planetPeriods[planetPeriods.length - 1].imageType,
      }),
      ...(value === 'landsat' && {
        year: landsatYear,
      }),
    });
    setMainMapSettings({
      showRecentImagery: value === 'recentImagery',
    });
    trackEvent({
      category: 'Map data',
      action: 'Basemap changed',
      label: upperFirst(value),
    });
  };

  return (
    <div className={cx('c-map-legend-basemaps', className)}>
      <header className="header">
        <button
          className="show-satellite-basemap-btn"
          title={`${activeBasemap.active ? 'Disable' : 'Enable'} ${
            activeBasemap.label
          }`}
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
          <h4>SATELLITE IMAGERY</h4>
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
                    onClick={(e) => handleSetSatelliteBasemap(e, basemap.value)}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalMetaSettings(basemap.infoModal);
                            }}
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
  isTropics: PropTypes.bool,
  planetPeriods: PropTypes.arrayOf(PropTypes.object),
  landsatYear: PropTypes.number.isRequired,
  setMainMapSettings: PropTypes.func.isRequired,
  setMapBasemap: PropTypes.func.isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.object),
  activeBasemap: PropTypes.object,
  setModalMetaSettings: PropTypes.func.isRequired,
};

export default SatelliteBasemaps;
