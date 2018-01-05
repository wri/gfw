import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';
import Button from 'components/button';
import Icon from 'components/icon';

import infoIcon from 'assets/icons/info.svg';
import './widget-settings-styles.scss';

class WidgetSettings extends PureComponent {
  render() {
    const { settings, isLoading, locationNames } = this.props;
    const {
      units,
      indicators,
      periods,
      thresholds,
      startYears,
      endYears
    } = this.props.options;
    const {
      onStartYearChange,
      onEndYearChange,
      onUnitChange,
      onPeriodChange,
      onThresholdChange,
      onIndicatorChange
    } = this.props.actions;
    
    return (
      <div className="c-widget-settings">
        {indicators &&
          onIndicatorChange && (
            <Dropdown
              theme="theme-select-light"
              label={`REFINE LOCATION WITHIN ${locationNames.current &&
                locationNames.current.label.toUpperCase()}`}
              value={settings.indicator}
              options={indicators}
              onChange={option => onIndicatorChange({ value: { indicator: option.value }, widget: 'TreeLoss' })}
              disabled={isLoading}
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
        {units &&
          onUnitChange && (
            <Dropdown
              theme="theme-select-light"
              label="UNIT"
              value={settings.unit}
              options={units}
              onChange={option => onUnitChange({ value: { unit: option.value }, widget: 'TreeLoss' })}
            />
          )}
        {periods &&
          onPeriodChange && (
            <Dropdown
              theme="theme-select-light"
              label="PERIOD"
              value={settings.period}
              options={periods}
              onChange={option => onPeriodChange(option.value)}
            />
          )}
        {startYears &&
          endYears &&
          onStartYearChange &&
          onEndYearChange && (
            <div className="years-select">
              <span className="label">YEARS</span>
              <div className="select-container">
                <Dropdown
                  theme="theme-select-button -transparent"
                  value={settings.startYear}
                  options={startYears}
                  onChange={option => onStartYearChange(option.value)}
                  disabled={isLoading}
                />
                <span className="text-date">to</span>
                <Dropdown
                  theme="theme-select-button -transparent"
                  value={settings.endYear}
                  options={endYears}
                  onChange={option => onEndYearChange(option.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
        {thresholds &&
          onThresholdChange && (
            <Dropdown
              theme="theme-select-button canopy-select"
              label="CANOPY DENSITY"
              value={settings.threshold}
              options={thresholds}
              onChange={option => onThresholdChange({ value: { threshold: option.value }, widget: 'TreeLoss' })}
              disabled={isLoading}
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
  onIndicatorChange: PropTypes.func,
  onThresholdChange: PropTypes.func,
  onUnitChange: PropTypes.func,
  onPeriodChange: PropTypes.func,
  onStartYearChange: PropTypes.func,
  onEndYearChange: PropTypes.func,
  isLoading: PropTypes.bool,
  locationNames: PropTypes.object,
  options: PropTypes.object,
  actions: PropTypes.object
};

export default WidgetSettings;
