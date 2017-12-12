import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettings from 'pages/country/widget/components/widget-settings';

import './widget-tree-cover-styles.scss';

class WidgetTreeCover extends PureComponent {
  render() {
    const {
      isLoading,
      data,
      indicators,
      units,
      thresholds,
      settings,
      setTreeCoverSettingsIndicator,
      setTreeCoverSettingsThreshold,
      locationNames
    } = this.props;
    return (
      <div className="c-widget c-widget-tree-cover">
        <WidgetHeader title="Tree cover extent" shareAnchor={'tree-cover'}>
          <WidgetSettings
            type="settings"
            indicators={indicators}
            units={units}
            thresholds={thresholds}
            settings={settings}
            onIndicatorChange={setTreeCoverSettingsIndicator}
            onThresholdChange={setTreeCoverSettingsThreshold}
            isLoading={isLoading}
            locationNames={locationNames}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <div className="pie-chart-container">
            <WidgetPieChartLegend data={data} settings={settings} />
            <WidgetPieChart className="cover-pie-chart" data={data} />
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  indicators: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setTreeCoverSettingsIndicator: PropTypes.func.isRequired,
  setTreeCoverSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeCover;
