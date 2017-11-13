import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select-me';

class WidgetTreeCoverGainSettings extends PureComponent {

  locationChange = (value) => {
    this.props.onLocationChange(value);
  };

  iconRenderer = () => {
    return(<svg className="icon icon-angle-arrow-down"><use xlinkHref="#icon-angle-arrow-down">{}</use></svg>);
  };

  render() {
    const {
      locations,
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
            onChange={this.locationChange}/>
        </div>
      </div>
    );
  }
}

WidgetTreeCoverGainSettings.propTypes = {
  locations: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default WidgetTreeCoverGainSettings;
