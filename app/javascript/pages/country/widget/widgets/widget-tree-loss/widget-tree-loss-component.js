import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import Loader from 'components/loader/loader';
import NoContent from 'components/no-content';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetTooltip from 'pages/country/widget/components/widget-tooltip';
import WidgetSettings from 'pages/country/widget/components/widget-settings';
import WidgetTreeLossTooltip from './widget-tree-loss-tooltip-component';

import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const {
      isLoading,
      viewOnMap,
      loss,
      extent,
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
            loss &&
            loss.length === 0 && (
              <NoContent
                message={`No loss data for ${locationNames.current &&
                  locationNames.current.label}`}
                icon
              />
            )}
          {!isLoading &&
            loss &&
            loss.length > 0 && (
              <div>
                <div className="sentence">{getSentence()}</div>
                <div className="chart">
                  <ResponsiveContainer height={247} width={'100%'}>
                    <BarChart
                      width={627}
                      height={247}
                      data={loss}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="year"
                        padding={{ top: 135 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        dataKey="area"
                        axisLine={false}
                        tickLine={false}
                        tickCount={7}
                      />
                      <CartesianGrid vertical={false} strokeDasharray="3 4" />
                      <Tooltip
                        content={
                          <WidgetTooltip>
                            <WidgetTreeLossTooltip extent={extent} />
                          </WidgetTooltip>
                        }
                      />
                      <Bar dataKey="area" barSize={22} fill="#fe6598" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

WidgetTreeLoss.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loss: PropTypes.array.isRequired,
  extent: PropTypes.number.isRequired,
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
