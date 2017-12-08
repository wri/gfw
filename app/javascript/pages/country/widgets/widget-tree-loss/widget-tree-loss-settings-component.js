import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeLossSettings extends PureComponent {
  render() {
    const {
      indicators,
      canopies,
      settings,
      startYears,
      endYears,
      onEndYearChange,
      onCanopyChange,
      onStartYearChange,
      onIndicatorChange,
      isLoading
    } = this.props;

    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="LOCATION"
            value={settings.indicator}
            options={indicators}
            onChange={option => onIndicatorChange(option.value)}
            disabled={isLoading}
          />
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
        </div>
        <div className="footer">
          <Dropdown
            theme="theme-select-button"
            label="CANOPY DENSITY"
            value={settings.canopy}
            options={canopies}
            onChange={option => onCanopyChange(option.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeLossSettings.propTypes = {
  indicators: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  startYears: PropTypes.array.isRequired,
  endYears: PropTypes.array.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired,
  onStartYearChange: PropTypes.func.isRequired,
  onEndYearChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default WidgetTreeLossSettings;
