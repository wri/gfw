import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import NoContent from 'components/no-content';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const {
      isLoading,
      viewOnMap,
      data,
      startYears,
      endYears,
      settings,
      thresholds,
      indicators,
      setTreeLossSettingsIndicator,
      setTreeLossSettingsThreshold,
      setTreeLossSettingsStartYear,
      setTreeLossSettingsEndYear,
      getSentence,
      size,
      locationNames
    } = this.props;

    return (
      <div className="c-widget c-widget-tree-loss">
        <WidgetHeader
          title={'Tree cover loss'}
          viewOnMapCallback={viewOnMap}
          shareAnchor={'tree-loss'}
          size={size}
        >
          <WidgetSettings
            isLoading={isLoading}
            type="settings"
            indicators={indicators}
            thresholds={thresholds}
            settings={settings}
            startYears={startYears}
            endYears={endYears}
            onIndicatorChange={setTreeLossSettingsIndicator}
            onThresholdChange={setTreeLossSettingsThreshold}
            onStartYearChange={setTreeLossSettingsStartYear}
            onEndYearChange={setTreeLossSettingsEndYear}
            locationNames={locationNames}
          />
        </WidgetHeader>
        <div className="container">
          {isLoading && <Loader />}
          {!isLoading &&
            data &&
            data.length === 0 && (
              <NoContent
                message={`No loss data for ${locationNames.current &&
                  locationNames.current.label}`}
                icon
              />
            )}
          {data &&
            data.length > 0 && (
              <div className="data-container">
                <WidgetDynamicSentence sentence={getSentence()} />
                <WidgetBarChart
                  className="loss-chart"
                  data={data}
                  xKey="year"
                  yKey="area"
                  config={{
                    color: '#fe6598',
                    tooltip: [
                      {
                        key: 'year',
                        unit: null
                      },
                      {
                        key: 'area',
                        unit: 'ha'
                      },
                      {
                        key: 'percentage',
                        unit: '%'
                      }
                    ]
                  }}
                />
              </div>
            )}
        </div>
      </div>
    );
  }
}

WidgetTreeLoss.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  thresholds: PropTypes.array.isRequired,
  indicators: PropTypes.array.isRequired,
  viewOnMap: PropTypes.func.isRequired,
  setTreeLossSettingsIndicator: PropTypes.func.isRequired,
  setTreeLossSettingsThreshold: PropTypes.func.isRequired,
  setTreeLossSettingsStartYear: PropTypes.func.isRequired,
  setTreeLossSettingsEndYear: PropTypes.func.isRequired,
  getSentence: PropTypes.func.isRequired,
  startYears: PropTypes.array.isRequired,
  endYears: PropTypes.array.isRequired,
  size: PropTypes.number,
  locationNames: PropTypes.object
};

export default WidgetTreeLoss;
