import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeCoverGainSettings extends PureComponent {
  render() {
    const { locations, settings, onLocationChange } = this.props;
    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="LOCATION"
            value={settings.location}
            options={locations}
            onChange={onLocationChange}
          />
        </div>
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
