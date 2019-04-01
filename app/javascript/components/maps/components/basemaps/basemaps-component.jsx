/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import closeIcon from 'assets/icons/close.svg';
import infoIcon from 'assets/icons/info.svg';
import { Tooltip } from 'react-tippy';
import Switch from 'components/ui/switch';

import './styles.scss';

class Basemaps extends React.PureComponent {
  static propTypes = {
    onClose: PropTypes.func,
    boundaries: PropTypes.array,
    basemaps: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    landsatYears: PropTypes.array.isRequired,
    selectLabels: PropTypes.func.isRequired,
    selectBasemap: PropTypes.func.isRequired,
    activeLabels: PropTypes.object.isRequired,
    activeBasemap: PropTypes.object.isRequired,
    selectBoundaries: PropTypes.func.isRequired,
    activeBoundaries: PropTypes.object,
    isDesktop: PropTypes.bool,
    getTooltipContentProps: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func,
    setMapSettings: PropTypes.func,
    planetInvertalOptions: PropTypes.array,
    planetIntervalSelected: PropTypes.object,
    planetBasemapSelected: PropTypes.object,
    planetYears: PropTypes.array,
    planetYearSelected: PropTypes.object,
    planetPeriods: PropTypes.array,
    planetPeriodSelected: PropTypes.object
  };

  renderButtonBasemap(item) {
    const { selectBasemap } = this.props;

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(item)}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <p className="basemaps-list-item-name">{item.label}</p>
      </button>
    );
  }

  renderLandsatBasemap(item) {
    const { selectBasemap, activeBasemap, landsatYears, basemaps } = this.props;
    const year = activeBasemap.year || landsatYears[0].value;
    const basemap = basemaps[item.value]
      ? basemaps[item.value]
      : basemaps.landsat;

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() =>
          selectBasemap({
            value: 'landsat',
            url: basemap.url.replace('{year}', basemap.defaultYear),
            year: basemap.defaultYear
          })
        }
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <div className="basemaps-list-item-selectors">
            <Dropdown
              className="landsat-selector"
              theme="theme-dropdown-native-inline"
              value={year}
              options={landsatYears}
              onChange={value => {
                const selectedYear = parseInt(value, 10);
                selectBasemap({
                  value: 'landsat',
                  url: basemap.url.replace('{year}', selectedYear),
                  year: selectedYear
                });
              }}
              native
            />
          </div>
        </span>
      </button>
    );
  }

  renderPlanetBasemap(item) {
    const {
      selectBasemap,
      planetInvertalOptions,
      planetIntervalSelected,
      planetBasemapSelected,
      planetYears,
      planetYearSelected,
      planetPeriods,
      planetPeriodSelected
    } = this.props;
    const { url, interval, year, period } = planetBasemapSelected || {};
    const basemap = {
      value: 'planet',
      url,
      interval,
      year,
      period
    };

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => selectBasemap(basemap)}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <div className="basemaps-list-item-selectors">
            <Tooltip
              useContext
              theme="light"
              arrow
              interactive
              html={
                <div className="c-basemaps-tooltip">
                  <Switch
                    theme="theme-switch-light"
                    label="Interval"
                    value={
                      planetIntervalSelected && planetIntervalSelected.value
                    }
                    options={planetInvertalOptions}
                    onChange={selected => {
                      const selectedInvertal = planetInvertalOptions.find(
                        f => f.value === selected
                      );
                      selectBasemap({
                        ...basemap,
                        interval: selected,
                        url: (selectedInvertal && selectedInvertal.url) || ''
                      });
                    }}
                  />
                  <div className="period-selector">
                    <Dropdown
                      label="Year"
                      theme="theme-dropdown-native"
                      value={planetYearSelected}
                      options={planetYears}
                      onChange={selected => {
                        const selectedYear = planetYears.find(
                          f => f.value === parseInt(selected, 10)
                        );
                        selectBasemap({
                          ...basemap,
                          year: parseInt(selected, 10),
                          url: (selectedYear && selectedYear.url) || ''
                        });
                      }}
                      native
                    />
                    <Dropdown
                      label="Period"
                      theme="theme-dropdown-native"
                      value={planetPeriodSelected}
                      options={planetPeriods}
                      onChange={selected => {
                        const selectedPeriod = planetPeriods.find(
                          f => f.value === selected
                        );
                        selectBasemap({
                          ...basemap,
                          period: selected,
                          url: (selectedPeriod && selectedPeriod.url) || ''
                        });
                      }}
                      native
                    />
                  </div>
                </div>
              }
              trigger="click"
              position="top"
            >
              <div>{planetBasemapSelected && planetBasemapSelected.label}</div>
            </Tooltip>
          </div>
        </span>
      </button>
    );
  }

  render() {
    const {
      onClose,
      activeLabels,
      activeBasemap,
      getTooltipContentProps,
      activeBoundaries,
      selectBoundaries,
      boundaries,
      basemaps,
      labels,
      isDesktop,
      setModalMetaSettings
    } = this.props;

    const selectedBoundaries = activeBoundaries
      ? { label: activeBoundaries.name }
      : boundaries && boundaries[0];
    return (
      <div
        className={cx('c-basemaps', 'map-tour-basemaps')}
        {...getTooltipContentProps()}
      >
        <div className="basemaps-top-section">
          {isDesktop && (
            <div className="basemaps-header">
              <h2 className="basemaps-title">Basemap Options</h2>
              <div className="basemaps-actions">
                <Button
                  className="info-btn"
                  theme="theme-button-tiny theme-button-grey-filled square"
                  onClick={() =>
                    setModalMetaSettings({ metakey: 'flagship_basemaps' })
                  }
                >
                  <Icon icon={infoIcon} />
                </Button>
                <button className="basemaps-action-button" onClick={onClose}>
                  <Icon icon={closeIcon} />
                </button>
              </div>
            </div>
          )}
          <ul className="basemaps-options-container">
            <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="boundaries"
                value={selectedBoundaries}
                options={boundaries}
                onChange={selectBoundaries}
              />
            </li>
            <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="labels"
                value={activeLabels}
                options={Object.values(labels)}
                onChange={this.props.selectLabels}
              />
            </li>
          </ul>
        </div>
        <div className="basemaps-bottom-section">
          <div className="basemap-list-scroll-wrapper">
            <ul className="basemaps-list">
              {Object.values(basemaps).map(item => {
                let basemapButton = this.renderButtonBasemap(item);
                if (item.value === 'landsat') {
                  basemapButton = this.renderLandsatBasemap(item);
                } else if (item.value === 'planet') {
                  basemapButton = this.renderPlanetBasemap(item);
                }

                return (
                  <li
                    key={item.value}
                    className={cx('basemaps-list-item', {
                      '-active': activeBasemap.value === item.value
                    })}
                  >
                    {basemapButton}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Basemaps;
