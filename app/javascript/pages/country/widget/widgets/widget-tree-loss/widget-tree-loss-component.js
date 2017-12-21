import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import NoContent from 'components/no-content';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const {
      isLoading,
      viewOnMap,
      data,
      options,
      settings,
      config,
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
          title="tree cover loss"
          shareAnchor={'tree-cover-gain'}
          locationNames={locationNames}
          viewOnMapCallback={viewOnMap}
          size={size}
          settingsConfig={{
            isLoading,
            config,
            settings,
            options,
            actions: {
              onIndicatorChange: setTreeLossSettingsIndicator,
              onThresholdChange: setTreeLossSettingsThreshold,
              onStartYearChange: setTreeLossSettingsStartYear,
              onEndYearChange: setTreeLossSettingsEndYear
            }
          }}
        />
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
  options: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  viewOnMap: PropTypes.func.isRequired,
  setTreeLossSettingsIndicator: PropTypes.func.isRequired,
  setTreeLossSettingsThreshold: PropTypes.func.isRequired,
  setTreeLossSettingsStartYear: PropTypes.func.isRequired,
  setTreeLossSettingsEndYear: PropTypes.func.isRequired,
  getSentence: PropTypes.func.isRequired,
  size: PropTypes.number,
  locationNames: PropTypes.object
};

export default WidgetTreeLoss;
