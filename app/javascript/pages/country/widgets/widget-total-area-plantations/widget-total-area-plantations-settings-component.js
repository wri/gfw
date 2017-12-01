import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTotalAreaPlantationsSettings extends PureComponent {
  unitChange = value => {
    this.props.onUnitChange(value.value);
  };

  render() {
    const { units, settings } = this.props;

    return (
      <div className="c-widget-settings">
        <Dropdown
          theme="theme-select-light"
          label="UNIT"
          value={settings.unit}
          options={units}
          onChange={this.unitChange}
        />
      </div>
    );
  }
}

WidgetTotalAreaPlantationsSettings.propTypes = {
  units: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onUnitChange: PropTypes.func
};

export default WidgetTotalAreaPlantationsSettings;
