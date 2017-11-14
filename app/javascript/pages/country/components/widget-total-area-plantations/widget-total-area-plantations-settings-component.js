import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetTotalAreaPlantationsSettings extends PureComponent {

  unitChange = (value) => {
    this.props.onUnitChange(value.value);
  };

  iconRenderer = () => {
    return(<svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg>);
  };

  render() {
    const {
      units,
      settings,
    } = this.props;

    return (
      <div className="c-widget-settings">
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">UNIT</div>
          <Select
            iconRenderer={this.iconRenderer}
            value={settings.unit}
            options={units}
            onChange={this.unitChange}/>
        </div>
      </div>
    );
  }
}

WidgetTotalAreaPlantationsSettings.propTypes = {
  units: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
};

export default WidgetTotalAreaPlantationsSettings;
