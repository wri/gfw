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
import WidgetHeader from 'pages/country/widgets/widget-header';
import WidgetTooltip from 'pages/country/widgets/widget-tooltip';
import WidgetTreeLossSettings from './widget-tree-loss-settings-component';
import WidgetTreeLossTooltip from './widget-tree-loss-tooltip-component';
import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  componentWillUpdate(nextProps) {
    const { isMetaLoading, setInitialData, updateData, settings } = this.props;

    if (JSON.stringify(settings) !== JSON.stringify(nextProps.settings)) {
      updateData(nextProps);
    }

    if (!nextProps.isMetaLoading && isMetaLoading) {
      setInitialData(nextProps);
    }
  }

  render() {
    const {
      isLoading,
      viewOnMap,
      loss,
      lossSentence,
      treeExtent,
      yearsLoss,
      settings,
      canopies,
      indicators,
      setTreeLossSettingsIndicator,
      setTreeLossSettingsCanopy,
      setTreeLossSettingsStartYear,
      setTreeLossSettingsEndYear
    } = this.props;

    return (
      <div className="c-widget c-widget-tree-loss">
        <WidgetHeader
          title={'Tree cover loss'}
          viewOnMapCallback={viewOnMap}
          shareAnchor={'tree-loss'}
        >
          <WidgetTreeLossSettings
            type="settings"
            indicators={indicators}
            canopies={canopies}
            settings={settings}
            yearsLoss={yearsLoss}
            onIndicatorChange={setTreeLossSettingsIndicator}
            onCanopyChange={setTreeLossSettingsCanopy}
            onStartYearChange={setTreeLossSettingsStartYear}
            onEndYearChange={setTreeLossSettingsEndYear}
          />
        </WidgetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className="c-widget-tree-loss__sentence">{lossSentence}</div>
            <div className="c-widget-tree-loss__chart">
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
                        <WidgetTreeLossTooltip extent={treeExtent} />
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
    );
  }
}

WidgetTreeLoss.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isMetaLoading: PropTypes.bool.isRequired,
  setInitialData: PropTypes.func.isRequired,
  loss: PropTypes.array.isRequired,
  lossSentence: PropTypes.string.isRequired,
  treeExtent: PropTypes.number.isRequired,
  yearsLoss: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
  canopies: PropTypes.array.isRequired,
  indicators: PropTypes.array.isRequired,
  viewOnMap: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
  setTreeLossSettingsIndicator: PropTypes.func.isRequired,
  setTreeLossSettingsCanopy: PropTypes.func.isRequired,
  setTreeLossSettingsStartYear: PropTypes.func.isRequired,
  setTreeLossSettingsEndYear: PropTypes.func.isRequired
};

export default WidgetTreeLoss;
