import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/dropdown';

class WidgetTreeCoverSettings extends PureComponent {
  render() {
    const {
      indicators,
      units,
      thresholds,
      settings,
      onIndicatorChange,
      onThresholdChange,
      onUnitChange,
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
            onChange={onIndicatorChange}
            disabled={isLoading}
          />
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            value={settings.unit}
            options={units}
            onChange={onUnitChange}
          />
        </div>
        <div className="footer">
          <Dropdown
            theme="theme-select-button"
            label="CANOPY DENSITY"
            value={settings.threshold}
            options={thresholds}
            onChange={onThresholdChange}
            disabled={isLoading}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeCoverSettings.propTypes = {
  indicators: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onThresholdChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default WidgetTreeCoverSettings;
