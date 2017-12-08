import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeCoverLossAreasSettings extends PureComponent {
  render() {
    const startYears = [];
    const endYears = [];
    const {
      regions,
      units,
      canopies,
      settings,
      years,
      onUnitChange,
      onCanopyChange,
      onStartYearChange,
      onEndYearChange,
      onLocationChange
    } = this.props;
    years.forEach(item => {
      if (item.value < settings.endYear) {
        startYears.push({
          label: item.label,
          value: item.value
        });
      }
      if (item.value > settings.startYear) {
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
            value={settings.region}
            options={regions}
            onChange={onLocationChange}
          />
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            value={settings.unit}
            options={units}
            onChange={onUnitChange}
          />
          <div className="years-select">
            <span className="label">YEARS</span>
            <div className="select-container">
              <Dropdown
                theme="theme-select-button -transparent"
                value={settings.startYear}
                options={startYears}
                onChange={onStartYearChange}
              />
              <span className="text-date">to</span>
              <Dropdown
                theme="theme-select-button -transparent"
                value={settings.endYear}
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
            value={settings.canopy === 0 ? '> 0%' : settings.canopy}
            options={canopies}
            onChange={onCanopyChange}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeCoverLossAreasSettings.propTypes = {
  regions: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  years: PropTypes.array.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired,
  onStartYearChange: PropTypes.func.isRequired,
  onEndYearChange: PropTypes.func.isRequired,
  onLocationChange: PropTypes.func
};

export default WidgetTreeCoverLossAreasSettings;
