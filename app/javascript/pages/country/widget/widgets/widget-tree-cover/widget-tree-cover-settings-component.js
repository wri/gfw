import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeCoverSettings extends PureComponent {
  render() {
    const {
      indicators,
      thresholds,
      settings,
      onIndicatorChange,
      onThresholdChange,
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
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  onThresholdChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default WidgetTreeCoverSettings;
