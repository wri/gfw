import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';
import Button from 'components/button';
import Icon from 'components/icon';

import infoIcon from 'assets/icons/info.svg';
import './widget-settings-styles.scss';

class WidgetSettings extends PureComponent {
  render() {
    const {
      settings,
      loading,
      locationNames,
      onSettingsChange,
      widget
    } = this.props;
    const {
      units,
      indicators,
      periods,
      thresholds,
      startYears,
      endYears
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
            optionRenderer={(option, selectedOptions) => (
              <div
                className={`dd__option ${
                  selectedOptions[0].value === option.value
                    ? 'dd__selectedOption'
                    : ''
                }`}
              >
                {option.label}
                <Button
                  disabled
                  className="theme-button-small square info-button"
                >
                  <Icon icon={infoIcon} className="info-icon" />
                </Button>
              </div>
            )}
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
            infoAction={() => console.info('open modal')}
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
  settings: PropTypes.object,
  startYears: PropTypes.array,
  endYears: PropTypes.array,
  loading: PropTypes.bool,
  locationNames: PropTypes.object,
  options: PropTypes.object,
  onSettingsChange: PropTypes.func,
  widget: PropTypes.string
};

export default WidgetSettings;
