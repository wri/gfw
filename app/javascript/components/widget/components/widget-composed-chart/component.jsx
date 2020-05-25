import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import ComposedChart from 'components/charts/composed-chart';
import Brush from 'components/charts/brush-chart';
import Legend from 'components/charts/components/chart-legend';

class WidgetComposedChart extends Component {
  static propTypes = {
    originalData: PropTypes.array,
    data: PropTypes.array,
    config: PropTypes.object,
    settings: PropTypes.object,
    settingsConfig: PropTypes.array,
    preventRenderKeys: PropTypes.array,
    handleChangeSettings: PropTypes.func,
    parseInteraction: PropTypes.func,
    active: PropTypes.bool,
    simple: PropTypes.bool,
    barBackground: PropTypes.string,
    toggleSettingsMenu: PropTypes.func
  };

  static defaultProps = {
    preventRenderKeys: []
  };

  shouldComponentUpdate(nextProps) {
    const { data, settings, config } = this.props;
    const {
      data: nextData,
      settings: nextSettings,
      config: nextConfig,
      preventRenderKeys: nextPreventRenderKeys
    } = nextProps;

    return (
      !isEqual(data, nextData) ||
      !isEqual(config, nextConfig) ||
      (!isEqual(
        omit(nextSettings, nextPreventRenderKeys),
        omit(settings, nextPreventRenderKeys)
      ) &&
        isEqual(nextSettings.interaction, settings.interaction))
    );
  }

  handleMouseMove = debounce(data => {
    const { parseInteraction, handleChangeSettings } = this.props;
    if (parseInteraction && handleChangeSettings) {
      const { activePayload } = data && data;
      if (activePayload && activePayload.length) {
        const interaction = parseInteraction(activePayload[0].payload);
        handleChangeSettings({ interaction });
      }
    }
  }, 100);

  handleMouseLeave = debounce(() => {
    const { handleChangeSettings } = this.props;
    if (handleChangeSettings) {
      handleChangeSettings({ interaction: {} });
    }
  }, 100);

  handleBrushEnd = ({ startIndex, endIndex }) => {
    const { originalData, handleChangeSettings } = this.props;
    if (handleChangeSettings) {
      handleChangeSettings({
        startIndex,
        endIndex,
        startDateAbsolute: originalData[startIndex].date,
        endDateAbsolute: originalData[endIndex].date
      });
    }
  };

  render() {
    const {
      originalData,
      data,
      config,
      settingsConfig,
      active,
      simple,
      barBackground,
      toggleSettingsMenu
    } = this.props;
    const { brush, legend } = config;
    const showLegendSettingsBtn = settingsConfig.some(
      conf => conf.key === 'compareYear'
    );

    return (
      <div className="c-widget-composed-chart">
        {!simple &&
          legend && (
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

        {!simple &&
          brush && (
          <Brush
            {...brush}
            data={originalData}
            onBrushEnd={this.handleBrushEnd}
          />
        )}
      </div>
    );
  }
}

export default WidgetComposedChart;
