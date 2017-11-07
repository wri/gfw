import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetTreeCoverSettings extends PureComponent {

  locationChange = (value) => {
    this.props.onLocationChange(value.value);
  };

  canopyChange = (value) => {
    this.props.onCanopyChange(value.value);
  };

  iconRenderer = () => {
    return(<svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg>);
  };

  render() {
    const {
      locations,
      canopies,
      settings
    } = this.props;

    return (
      <div className="c-widget-settings">
        <div className="c-widget-settings__select">
          <div className="c-widget-settings__title">LOCATION</div>
          <Select
            iconRenderer={this.iconRenderer}
            value={settings.location}
            options={locations}
            onChange={this.locationChange}
          />
        </div>
        <div className="c-widget-settings__button-select">
          <div className="c-widget-settings__title">CANOPY DENSITY</div>
          <Select
            value={settings.canopy === 0 ? '> 0%' : settings.canopy}
            options={canopies}
            onChange={this.canopyChange}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeCoverSettings.propTypes = {
  locations: PropTypes.array.isRequired,
  canopies: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  onCanopyChange: PropTypes.func.isRequired
};

export default WidgetTreeCoverSettings;
