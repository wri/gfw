import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

import './widget-settings-styles.scss';

class WidgetSettings extends PureComponent {
  render() {
    const {
      units,
      indicators,
      thresholds,
      settings,
      startYears,
      endYears,
      dataSources,
      onStartYearChange,
      onEndYearChange,
      onUnitChange,
      onThresholdChange,
      onIndicatorChange,
      onDataSourceChange,
      isLoading
    } = this.props;

    return (
      <div className="c-widget-settings">
        <div className="body">
          {dataSources &&
            onDataSourceChange && (
              <Dropdown
                theme="theme-select-light"
                label="DATA SOURCE"
                value={settings.dataSource}
                options={dataSources}
                onChange={option => onDataSourceChange(option.value)}
                disabled={isLoading}
              />
            )}
          {indicators &&
            onIndicatorChange && (
              <Dropdown
                theme="theme-select-light"
                label="LOCATION"
                value={settings.indicator}
                options={indicators}
                onChange={option => onIndicatorChange(option.value)}
                disabled={isLoading}
              />
            )}
          {units &&
            onUnitChange && (
              <Dropdown
                theme="theme-select-light"
                label="UNIT"
                value={settings.unit}
                options={units}
                onChange={option => onUnitChange(option.value)}
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
        </div>
        {thresholds &&
          onThresholdChange && (
            <div className="footer">
              <Dropdown
                theme="theme-select-button"
                label="CANOPY DENSITY"
                value={settings.threshold}
                options={thresholds}
                onChange={option => onThresholdChange(option.value)}
                disabled={isLoading}
              />
            </div>
          )}
      </div>
    );
  }
}

WidgetSettings.propTypes = {
  indicators: PropTypes.array,
  thresholds: PropTypes.array,
  units: PropTypes.array,
  settings: PropTypes.object,
  startYears: PropTypes.array,
  endYears: PropTypes.array,
  dataSources: PropTypes.array,
  onIndicatorChange: PropTypes.func,
  onThresholdChange: PropTypes.func,
  onUnitChange: PropTypes.func,
  onStartYearChange: PropTypes.func,
  onEndYearChange: PropTypes.func,
  onDataSourceChange: PropTypes.func,
  isLoading: PropTypes.bool
};

export default WidgetSettings;
