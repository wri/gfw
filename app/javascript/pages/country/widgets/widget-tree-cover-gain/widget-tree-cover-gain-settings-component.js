import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeCoverGainSettings extends PureComponent {
  locationChange = value => {
    this.props.onLocationChange(value);
  };

  iconRenderer = () => (
    <svg className="icon icon-angle-arrow-down">
      <use xlinkHref="#icon-angle-arrow-down">{}</use>
    </svg>
  );

  render() {
    const { locations, settings } = this.props;
    return (
      <div className="c-widget-settings">
        <Dropdown
          theme="theme-select-light"
          label="LOCATION"
          value={settings.location}
          options={locations}
          onChange={this.locationChange}
        />
      </div>
    );
  }
}

WidgetTreeCoverGainSettings.propTypes = {
  locations: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onLocationChange: PropTypes.func
};

export default WidgetTreeCoverGainSettings;
