import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/dropdown';

class WidgetTreeCoverSettings extends PureComponent {
  render() {
    const {
      locationNames,
      indicators,
      units,
      canopies,
      settings,
      onLocationChange,
      onCanopyChange,
      onUnitChange
    } = this.props;

    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label={`REFINE LOCATION WITHIN ${locationNames.current.label.toUpperCase()}`}
            value={settings.indicator}
            options={indicators}
            onChange={onLocationChange}
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
            value={settings.canopy}
            options={canopies}
            onChange={onCanopyChange}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeCoverSettings.propTypes = {
  locationNames: PropTypes.object.isRequired,
  indicators: PropTypes.array,
  units: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired
};

export default WidgetTreeCoverSettings;
