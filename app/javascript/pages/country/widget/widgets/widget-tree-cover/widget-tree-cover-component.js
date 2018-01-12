import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-cover-styles.scss';

class WidgetTreeCover extends PureComponent {
  render() {
    const { parsedData, settings, getSentence } = this.props;

    return (
      <div className="c-widget-tree-cover">
        {parsedData && (
          <div>
            <WidgetDynamicSentence sentence={getSentence()} />
            <div className="pie-chart-container">
              <WidgetPieChartLegend
                data={parsedData}
                config={{
                  ...settings,
                  format: '.3s',
                  unit: 'ha',
                  key: 'value'
                }}
              />
              <WidgetPieChart className="cover-pie-chart" data={parsedData} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetTreeCover;
