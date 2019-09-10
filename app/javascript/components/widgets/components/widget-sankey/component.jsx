import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import MediaQuery from 'react-responsive';
import { SCREEN_M } from 'utils/constants';
import isEmpty from 'lodash/isEmpty';

import SankeyChart from 'components/charts/sankey-chart/sankey';

import './styles';

class WidgetSankey extends PureComponent {
  handleOnClick = debounce(data => {
    const { parsePayload, setWidgetsSettings, widget } = this.props;
    if (parsePayload) {
      const { payload } = data;
      const activeData = parsePayload(payload);
      setWidgetsSettings({ widget, data: { ...activeData } });
    }
  }, 100);

  handleOutsideClick = debounce(() => {
    const { setWidgetsSettings, widget } = this.props;
    setWidgetsSettings({ widget, data: {} });
  }, 100);

  render() {
    const { data, dataConfig, settings } = this.props;
    const { unit, startYear, endYear } = settings;
    const { selectedElement } = data;
    const selected = !isEmpty(settings.activeData)
      ? settings.activeData
      : selectedElement;
    const shouldHighlight = item => {
      if (!selected) return false;
      if (selected.source && selected.target) {
        // if link hovering:
        return (
          selected.source.key === item.key || // start node highlighting
          selected.target.key === item.key || // end node highlighting
          selected.key === item.key
        ); // link highlighting
      }
      return (
        selected.key === item.key || // node hovering, highlight node
        (item.source && selected.key === item.source.key) || // start node hovering, highlight link
        (item.target && selected.key === item.target.key)
      ); // end node hovering, highlight link
    };

    const config = {
      tooltip: {
        scale: 1 / 1000,
        unit: unit || 'ha'
      },
      node: {
        scale: 1 / 1000,
        suffix: 'node',
        highlight: node => shouldHighlight(node)
      },
      link: {
        highlight: link => shouldHighlight(link)
      },
      nodeTitles: [startYear, endYear],
      ...dataConfig,
      ...this.props.config // dataConfig in selectors.js
    };

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className="c-sankey-chart-widget">
            <SankeyChart
              data={data}
              config={config}
              height={300}
              nodeWidth={50}
              // handleMouseOver={this.handleMouseMove}
              // handleMouseLeave={this.handleMouseLeave}
              handleOnClick={this.handleOnClick}
              handleOutsideClick={this.handleOutsideClick}
              margin={{
                top: 10,
                left: isDesktop ? 50 : 1,
                right: isDesktop ? 50 : 1,
                bottom: 50
              }}
            />
          </div>
        )}
      </MediaQuery>
    );
  }
}

WidgetSankey.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
  dataConfig: PropTypes.object,
  settings: PropTypes.object,
  parsePayload: PropTypes.func,
  setWidgetsSettings: PropTypes.func,
  widget: PropTypes.string
};

export default WidgetSankey;
