import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTotalAreaPlantationsSettings extends PureComponent {
  render() {
    const { units, settings, onUnitChange } = this.props;
    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="UNIT"
            value={settings.unit}
            options={units}
            onChange={onUnitChange}
          />
        </div>
      </div>
    );
  }
}

WidgetTotalAreaPlantationsSettings.propTypes = {
  units: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onUnitChange: PropTypes.func.isRequired
};

export default WidgetTotalAreaPlantationsSettings;
