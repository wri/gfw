import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import './widget-tree-located-styles.scss';

class WidgetTreeLocated extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      data,
      indicators,
      units,
      thresholds,
      settings,
      handlePageChange,
      setTreeLocatedSettingsIndicator,
      setTreeLocatedSettingsUnit,
      setTreeLocatedSettingsThreshold
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-located">
        <WidgetHeader
          title={`Where are the forest located in ${locationNames.current &&
            locationNames.current.label}`}
          shareAnchor={'tree-located'}
        >
          <WidgetSettings
            type="settings"
            indicators={indicators}
            units={units}
            thresholds={thresholds}
            settings={settings}
            onIndicatorChange={setTreeLocatedSettingsIndicator}
            onUnitChange={setTreeLocatedSettingsUnit}
            onThresholdChange={setTreeLocatedSettingsThreshold}
            isLoading={isLoading}
            locationNames={locationNames}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <WidgetNumberedList
            className="locations-list"
            data={data}
            settings={settings}
            handlePageChange={handlePageChange}
            colorRange={['#113002', '#e7e5a4']}
          />
        )}
      </div>
    );
  }
}

WidgetTreeLocated.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object,
  data: PropTypes.array.isRequired,
  indicators: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  setTreeLocatedSettingsIndicator: PropTypes.func.isRequired,
  setTreeLocatedSettingsUnit: PropTypes.func.isRequired,
  setTreeLocatedSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeLocated;
