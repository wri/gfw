import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeLossSettings extends PureComponent {
  render() {
    const {
      indicators,
      canopies,
      settings,
      yearsLoss,
      onEndYearChange,
      onCanopyChange,
      onStartYearChange,
      onIndicatorChange
    } = this.props;
    const startYears = [];
    const endYears = [];
    yearsLoss.forEach(item => {
      if (item.value < settings.endYear.value) {
        startYears.push({
          label: item.label,
          value: item.value
        });
      }
      if (item.value > settings.startYear.value) {
        endYears.push({
          label: item.label,
          value: item.value
        });
      }
    });

    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="LOCATION"
            value={settings.indicator.value}
            options={indicators}
            onChange={onIndicatorChange}
          />
          <div className="years-select">
            <span className="label">YEARS</span>
            <div className="select-container">
              <Dropdown
                theme="theme-select-button -transparent"
                value={settings.startYear.value}
                options={startYears}
                onChange={onStartYearChange}
              />
              <span className="text-date">to</span>
              <Dropdown
                theme="theme-select-button -transparent"
                value={settings.endYear.value}
                options={endYears}
                onChange={onEndYearChange}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <Dropdown
            theme="theme-select-button"
            label="CANOPY DENSITY"
            value={settings.canopy.value}
            options={canopies}
            onChange={onCanopyChange}
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
  yearsLoss: PropTypes.array.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired,
  onStartYearChange: PropTypes.func.isRequired,
  onEndYearChange: PropTypes.func.isRequired
};

export default WidgetTreeLossSettings;
