import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetComposedChart from 'components/widgets/components/widget-composed-chart';
import WidgetNumberedList from 'components/widgets/components/widget-numbered-list';

import './styles';

class WidgetChartAndList extends PureComponent {
  handleClick = payload => {
    const { setWidgetSettings, widget, parsePayload } = this.props;
    if (parsePayload) {
      const settings = parsePayload(payload);
      if (settings) setWidgetSettings({ value: parsePayload(payload), widget });
    }
  };

  render() {
    const {
      data,
      config,
      active,
      simple,
      widget,
      embed,
      settings,
      setWidgetSettings,
      setWidgetsSettings
    } = this.props;
    const { percentiles, list } = data;

    return (
      <div className="c-widget-chart-and-list">
        <WidgetComposedChart
          className="widget-combined-chart"
          data={percentiles}
          config={config}
          active={active}
          simple={simple}
          handleClick={this.handleClick}
          setWidgetsSettings={setWidgetsSettings}
        />
        <WidgetNumberedList
          className="widget-combined-list"
          data={list}
          settings={settings}
          setWidgetSettings={setWidgetSettings}
          embed={embed}
          widget={widget}
        />
      </div>
    );
  }
}

WidgetChartAndList.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  settings: PropTypes.object,
  setWidgetsSettings: PropTypes.func,
  widget: PropTypes.string,
  active: PropTypes.bool,
  simple: PropTypes.bool,
  embed: PropTypes.bool,
  setWidgetSettings: PropTypes.func,
  parsePayload: PropTypes.func
};

export default WidgetChartAndList;
