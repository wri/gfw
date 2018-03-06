import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/dropdown-new';

import './widget-settings-styles.scss';

class WidgetSettings extends PureComponent {
  render() {
    const {
      settings,
      loading,
      locationNames,
      onSettingsChange,
      widget,
      setModalMeta
    } = this.props;
    const {
      units,
      indicators,
      periods,
      thresholds,
      years,
      startYears,
      endYears,
      extentYears,
      types,
      weeks
    } = this.props.options;

    return (
      <div className="c-widget-settings">
        {indicators && (
          <Dropdown
            theme="theme-select-light"
            label={`REFINE LOCATION WITHIN ${locationNames.current &&
              locationNames.current.label.toUpperCase()}`}
            value={settings.indicator}
            options={indicators}
            onChange={option =>
              onSettingsChange({ value: { indicator: option.value }, widget })
            }
            disabled={loading}
            optionsAction={setModalMeta}
            optionsActionKey="metaKey"
          />
        )}
        {types && (
          <Dropdown
            theme="theme-select-light"
            label="DISPLAY TREES BY"
            value={settings.type}
            options={types}
            disabled={loading}
            onChange={option => {
              const layers = [...settings.layers];
              if (layers.length) {
                const type = settings.type === 'bound2' ? 'species' : 'type';
                const newType = option.value === 'bound2' ? 'species' : 'type';
                const activeIndex = settings.layers.indexOf(
                  `plantations_by_${type}`
                );
                layers[activeIndex] = `plantations_by_${newType}`;
              }
              onSettingsChange({
                value: {
                  type: option.value,
                  layers
                },
                widget
              });
            }}
            infoAction={() => setModalMeta('widget_tree_cover_extent')}
          />
        )}
        {weeks && (
          <Dropdown
            theme="theme-select-light"
            label="SHOW DATA FOR THE LAST"
            value={settings.weeks}
            options={weeks}
            disabled={loading}
            onChange={option =>
              onSettingsChange({ value: { weeks: option.value }, widget })
            }
          />
        )}
        {extentYears && (
          <Dropdown
            theme="theme-select-light"
            label="EXTENT YEAR"
            value={settings.extentYear}
            options={extentYears}
            disabled={loading}
            onChange={option => {
              const layers = [...settings.layers];
              if (layers.length) {
                const activeIndex = settings.layers.indexOf(
                  `forest${settings.extentYear}`
                );
                layers[activeIndex] = `forest${option.value}`;
              }
              onSettingsChange({
                value: {
                  extentYear: option.value,
                  layers
                },
                widget
              });
            }}
          />
        )}
        {units && (
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            value={settings.unit}
            options={units}
            onChange={option =>
              onSettingsChange({ value: { unit: option.value }, widget })
            }
          />
        )}
        {periods && (
          <Dropdown
            theme="theme-select-light"
            label="PERIOD"
            value={settings.period}
            options={periods}
            onChange={option =>
              onSettingsChange({ value: { period: option.value }, widget })
            }
          />
        )}
        {years && (
          <Dropdown
            theme="theme-select-light"
            label="YEAR"
            value={settings.year}
            options={years}
            onChange={option =>
              onSettingsChange({ value: { year: option.value }, widget })
            }
          />
        )}
        {startYears &&
          endYears && (
            <div className="years-select">
              <span className="label">YEARS</span>
              <div className="select-container">
                <Dropdown
                  theme="theme-select-button"
                  value={settings.startYear}
                  options={startYears}
                  onChange={option =>
                    onSettingsChange({
                      value: { startYear: option.value },
                      widget
                    })
                  }
                  disabled={loading}
                />
                <span className="text-date">to</span>
                <Dropdown
                  theme="theme-select-button"
                  value={settings.endYear}
                  options={endYears}
                  onChange={option =>
                    onSettingsChange({
                      value: { endYear: option.value },
                      widget
                    })
                  }
                  disabled={loading}
                />
              </div>
            </div>
          )}
        {thresholds && (
          <Dropdown
            theme="theme-select-button canopy-select"
            label="CANOPY DENSITY"
            value={settings.threshold}
            options={thresholds}
            onChange={option =>
              onSettingsChange({ value: { threshold: option.value }, widget })
            }
            disabled={loading}
            infoAction={() => setModalMeta('widget_canopy_density')}
          />
        )}
      </div>
    );
  }
}

WidgetSettings.propTypes = {
  indicators: PropTypes.array,
  thresholds: PropTypes.array,
  units: PropTypes.array,
  periods: PropTypes.array,
  years: PropTypes.array,
  settings: PropTypes.object,
  startYears: PropTypes.array,
  endYears: PropTypes.array,
  loading: PropTypes.bool,
  locationNames: PropTypes.object,
  options: PropTypes.object,
  onSettingsChange: PropTypes.func,
  widget: PropTypes.string,
  setModalMeta: PropTypes.func
};

export default WidgetSettings;
