import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Media } from 'utils/responsive';
import isEmpty from 'lodash/isEmpty';

import SankeyChart from 'components/charts/sankey-chart';

import './styles.scss';

class WidgetSankey extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    config: PropTypes.object,
    settings: PropTypes.object,
    parseInteraction: PropTypes.func,
    handleChangeSettings: PropTypes.func
  };

  handleOnClick = debounce(data => {
    const { parseInteraction, handleChangeSettings } = this.props;
    if (parseInteraction) {
      const { payload } = data;
      const activeData = parseInteraction(payload);
      handleChangeSettings({ interaction: activeData });
    }
  }, 100);

  handleOutsideClick = debounce(() => {
    const { handleChangeSettings } = this.props;
    handleChangeSettings({ interaction: {} });
  }, 100);

  render() {
    const { data, config, settings } = this.props;
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

    const configMerged = {
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
      ...config
    };

    return (
      <div className="c-sankey-chart-widget">
        <Media greaterThanOrEqual="md">
          <SankeyChart
            data={data}
            config={configMerged}
            height={300}
            nodeWidth={50}
            handleOnClick={this.handleOnClick}
            handleOutsideClick={this.handleOutsideClick}
            margin={{
              top: 10,
              left: 50,
              right: 50,
              bottom: 50
            }}
          />
        </Media>
        <Media lessThan="md">
          <SankeyChart
            data={data}
            config={configMerged}
            height={300}
            nodeWidth={50}
            handleOnClick={this.handleOnClick}
            handleOutsideClick={this.handleOutsideClick}
            margin={{
              top: 10,
              left: 1,
              right: 1,
              bottom: 50
            }}
          />
        </Media>
      </div>
    );
  }
}

export default WidgetSankey;
