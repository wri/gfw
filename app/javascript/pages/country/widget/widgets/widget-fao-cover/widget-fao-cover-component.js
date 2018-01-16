import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import './widget-fao-cover-styles.scss';

class WidgetFAOCover extends PureComponent {
  render() {
    const { data, getSentence } = this.props;

    return (
      <div className="c-widget-fao-cover">
        {data &&
          data.length > 0 && (
            <div>
              <WidgetDynamicSentence sentence={getSentence()} />
              <div className="pie-chart-container">
                <WidgetPieChartLegend
                  className="pie-chart-legend"
                  data={data}
                  settings={{
                    unit: '%',
                    format: '.1f',
                    key: 'percentage'
                  }}
                />
                <WidgetPieChart
                  className="cover-pie-chart"
                  data={data}
                  maxSize={140}
                />
              </div>
            </div>
          )}
      </div>
    );
  }
}

WidgetFAOCover.propTypes = {
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetFAOCover;
