import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/dropdown';

class WidgetTreeCoverGainSettings extends PureComponent {
  render() {
    const { indicators, settings, onIndicatorChange } = this.props;
    return (
      <div className="c-widget-settings">
        <div className="body">
          <Dropdown
            theme="theme-select-light"
            label="LOCATION"
            value={settings.indicator}
            options={indicators}
            onChange={option => onIndicatorChange(option.value)}
          />
        </div>
      </div>
    );
  }
}

WidgetTreeCoverGainSettings.propTypes = {
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  onIndicatorChange: PropTypes.func
};

export default WidgetTreeCoverGainSettings;
