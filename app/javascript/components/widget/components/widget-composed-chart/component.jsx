import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import ComposedChart from 'components/charts/composed-chart';

class WidgetComposedChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    config: PropTypes.object,
    settings: PropTypes.object,
    preventRenderKeys: PropTypes.array,
    handleChangeSettings: PropTypes.func,
    parseInteraction: PropTypes.func,
    active: PropTypes.bool,
    simple: PropTypes.bool,
    barBackground: PropTypes.string
  };

  static defaultProps = {
    preventRenderKeys: []
  };

  shouldComponentUpdate(nextProps) {
    const { data, settings } = this.props;
    const {
      data: nextData,
      settings: nextSettings,
      preventRenderKeys: nextPreventRenderKeys
    } = nextProps;

    return (
      !isEqual(data, nextData) ||
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

  handleBrush = debounce(values => {
    const { handleChangeSettings } = this.props;
    if (handleChangeSettings) {
      handleChangeSettings(values);
    }
  }, 100);

  render() {
    const { data, config, active, simple, barBackground } = this.props;

    return (
      <div className="c-widget-composed-chart">
        <ComposedChart
          className="loss-chart"
          data={data}
          config={config}
          handleMouseMove={this.handleMouseMove}
          handleMouseLeave={this.handleMouseLeave}
          handleBrush={this.handleBrush}
          backgroundColor={active ? '#fefedc' : ''}
          barBackground={barBackground}
          simple={simple}
        />
      </div>
    );
  }
}

export default WidgetComposedChart;
