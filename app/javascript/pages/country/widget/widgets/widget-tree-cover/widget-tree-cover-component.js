import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';

import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
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
      setTreeCoverSettingsThreshold
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
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <div>
            <ul className="legend">
              {data.map(
                (item, index) =>
                  (item.value ? (
                    <li key={index.toString()}>
                      <div className="legend-title">
                        <span style={{ backgroundColor: item.color }}>{}</span>
                        {item.name}
                      </div>
                      <div
                        className="legend-value"
                        style={{ color: item.color }}
                      >
                        {format('.3s')(item.value)}ha
                        <span className="unit-text"> {settings.unit}</span>
                      </div>
                    </li>
                  ) : null)
              )}
            </ul>
            <div className="chart">
              <WidgetPieChart data={data} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  indicators: PropTypes.array.isRequired,
  units: PropTypes.array.isRequired,
  thresholds: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  setTreeCoverSettingsIndicator: PropTypes.func.isRequired,
  setTreeCoverSettingsThreshold: PropTypes.func.isRequired
};

export default WidgetTreeCover;
