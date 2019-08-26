import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SankeyChart from 'components/charts/sankey-chart/sankey';

import './styles';

class WidgetSankey extends PureComponent {
  render() {
    const { data, settings } = this.props;

    const config = {
      tooltip: {
        scale: 1 / 1000,
        suffix: settings.unit || 'ha'
        // unit: 'tpu'
      },
      node: {
        scale: 1 / 1000,
        suffix: 'node'
      }
    };

    return (
      <div className="c-sankey-chart-widget">
        <SankeyChart data={data} config={config} height={400} />
      </div>
    );
  }
}

WidgetSankey.propTypes = {
  data: PropTypes.object,
  settings: PropTypes.object
};

export default WidgetSankey;
