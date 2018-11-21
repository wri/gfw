import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// TODO: rename WidgetAlerts to WidgetComposedChart or smth
import WidgetAlerts from 'components/widgets/components/widget-composed-chart';
import WidgetNumberedList from 'components/widgets/components/widget-numbered-list';

import './styles';

class WidgetChartAndList extends PureComponent {
  handleClick = payload => {
    // console.log(payload);
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
      <div className="c-chart-and-list">
        <div className="c-chart">
          <WidgetAlerts
            data={percentiles}
            config={config}
            active={active}
            simple={simple}
            handleClick={this.handleClick}
            setWidgetsSettings={setWidgetsSettings}
          />
        </div>
        <div className="c-list">
          <WidgetNumberedList
            data={list}
            settings={settings}
            setWidgetSettings={setWidgetSettings}
            embed={embed}
            widget={widget}
          />
        </div>
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
