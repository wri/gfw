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

import satelliteImage from 'components/map/images/satellite.png';
import BasemapSettings from './basemap-settings';

function handleTitle(basemap) {
  return (
    <>
      <span className="label-caveat">
        <span className="label">{basemap?.label || ''}</span>
        {basemap?.caveat && <span className="caveat">{basemap.caveat}</span>}
      </span>
    </>
  );
}

const SatelliteBasemaps = ({
  className,
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
        value: 'satellite',
        color: '',
        name: '',
      });
      setDefaultSatSet(true);
      trackEvent({
        category: 'Map data',
        action: 'Basemap changed',
        label: 'Auto select planet isTropics',
      });
    }
  }, [isTropics, defaultSatSet]);

  let sortedBasemaps = basemaps;
  if (basemaps.length >= 4) {
    sortedBasemaps = [
      basemaps[1],
      ...basemaps.slice(0, 1),
      ...basemaps.slice(2),
    ];
  }

  const handleToggleActive = () => {
    setOpen(!activeBasemap?.active);
    setMapBasemap({
      value: activeBasemap?.active ? 'default' : activeBasemap?.value,
      ...(activeBasemap?.value === 'landsat' && {
        year: landsatYear,
      }),
    });
    setMainMapSettings({
      showRecentImagery: activeBasemap?.active
        ? false
        : activeBasemap?.value === 'recentImagery',
    });
    trackEvent({
      category: 'Map data',
      action: 'Basemap changed',
      label: upperFirst(activeBasemap?.value),
    });
  };

  const handleSetSatelliteBasemap = (e, value) => {
    e.stopPropagation();
    setMapBasemap({
      value,
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
          title={`${activeBasemap?.active ? 'Disable' : 'Enable'} ${
            activeBasemap?.label || ''
          }`}
          onClick={handleToggleActive}
        >
          <Checkbox
            id="satellite-imagery-checkbox"
            className="satellite-basemap-checkbox"
            value={activeBasemap?.active}
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
            {sortedBasemaps.map((basemap) => {
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
                    id={`imagery-item-${basemap.value}`}
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
                      <span className="satellite-basemap--title-info">
                        <span className="satellite-basemap--title">
                          {basemap.label}
                        </span>
                        <span className="satellite-basemap--info">
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
            <li className="satellite-dummy">
              <img
                src={satelliteImage}
                alt="Planet Satellite Imagery"
                className="satellite-basemap--thumbnail"
              />
              <div className="satellite-basemap--content">
                <span className="satellite-basemap--title-info">
                  <span className="satellite-basemap--title">
                    Planet Satellite Imagery
                  </span>
                </span>
                <p className="satellite-basemap--description">
                  Not currently available.{' '}
                  <a
                    href="https://www.globalforestwatch.org/blog/data-and-tools/planet-imagery-changes-gfw/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read our blog
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://survey.alchemer.com/s3/8260607/Planet-Imagery?utm_campaign=planetupdate2025&utm_medium=bitly&utm_source=GFWNoticeBoard"
                    target="_blank"
                    rel="noreferrer"
                  >
                    let us know if this impacts your work
                  </a>
                  .
                </p>
              </div>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
};

SatelliteBasemaps.propTypes = {
  className: PropTypes.string,
  isTropics: PropTypes.bool,
  landsatYear: PropTypes.number.isRequired,
  setMainMapSettings: PropTypes.func.isRequired,
  setMapBasemap: PropTypes.func.isRequired,
  basemaps: PropTypes.arrayOf(PropTypes.object),
  activeBasemap: PropTypes.object,
  setModalMetaSettings: PropTypes.func.isRequired,
};

export default SatelliteBasemaps;
