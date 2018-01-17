import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-intact-tree-cover-styles.scss';

class WidgetIntactTreeCover extends PureComponent {
  render() {
    const { parsedData, settings, sentence } = this.props;

    return (
      <div className="c-widget-intact-tree-cover">
        {parsedData && (
          <div>
            <WidgetDynamicSentence sentence={sentence} />
            <div className="pie-chart-container">
              <WidgetPieChartLegend
                className="cover-legend"
                data={parsedData}
                config={{
                  ...settings,
                  format: '.3s',
                  unit: 'ha',
                  key: 'value'
                }}
              />
              <WidgetPieChart
                className="cover-pie-chart"
                data={parsedData}
                maxSize={140}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetIntactTreeCover.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired,
  sentence: PropTypes.string.isRequired
};

export default WidgetIntactTreeCover;
