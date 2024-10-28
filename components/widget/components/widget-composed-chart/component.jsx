import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import ComposedChart from 'components/charts/composed-chart';
import Brush from 'components/charts/brush-chart';
import Legend from 'components/charts/components/chart-legend';
import ChartLegend from '../widget-chart-legend';

class WidgetComposedChart extends Component {
  static propTypes = {
    analysis: PropTypes.bool,
    originalData: PropTypes.array,
    data: PropTypes.array,
    config: PropTypes.object,
    settings: PropTypes.object,
    settingsConfig: PropTypes.array,
    preventRenderKeys: PropTypes.array,
    handleSetInteraction: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    parseInteraction: PropTypes.func,
    active: PropTypes.bool,
    simple: PropTypes.bool,
    barBackground: PropTypes.string,
    toggleSettingsMenu: PropTypes.func,
  };

  static defaultProps = {
    preventRenderKeys: [],
  };

  handleMouseMove = debounce((data) => {
    const { parseInteraction, handleSetInteraction } = this.props;
    if (parseInteraction && handleSetInteraction) {
      const { activePayload } = data && data;
      if (activePayload && activePayload.length) {
        const interaction = parseInteraction(activePayload[0].payload);
        handleSetInteraction(interaction);
      }
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { handleSetInteraction, parseInteraction } = this.props;
    if (parseInteraction && handleSetInteraction) {
      handleSetInteraction(null);
    }
  }, 100);

  handleBrushEnd = ({ startIndex, endIndex }) => {
    const { originalData, handleChangeSettings } = this.props;

    if (handleChangeSettings) {
      const dataEnd =
        originalData[endIndex] || originalData[originalData.length - 1];

      handleChangeSettings({
        startIndex,
        endIndex,
        startDateAbsolute: originalData[startIndex]?.date,
        endDateAbsolute: dataEnd.date,
      });
    }
  };

  render() {
    const {
      analysis,
      originalData,
      data,
      config,
      settingsConfig,
      active,
      simple,
      barBackground,
      toggleSettingsMenu,
    } = this.props;
    const { brush, legend, chartLegend } = config;
    const showLegendSettingsBtn =
      settingsConfig &&
      settingsConfig.some((conf) => conf.key === 'compareYear');

    return (
      <div className="c-widget-composed-chart">
        {!simple && legend && (
          <Legend
            data={data}
            config={legend}
            simple={simple}
            toggleSettingsMenu={showLegendSettingsBtn && toggleSettingsMenu}
          />
        )}

        <ComposedChart
          className="loss-chart"
          data={data}
          config={config}
          backgroundColor={active ? '#fefedc' : ''}
          barBackground={barBackground}
          simple={simple}
          active={active}
          handleMouseMove={this.handleMouseMove}
          handleMouseLeave={this.handleMouseLeave}
        />

        {!simple && brush && (
          <Brush
            {...brush}
            data={originalData}
            onBrushEnd={this.handleBrushEnd}
          />
        )}

        {chartLegend && <ChartLegend data={chartLegend} vertical={analysis} />}
      </div>
    );
  }
}

export default WidgetComposedChart;
