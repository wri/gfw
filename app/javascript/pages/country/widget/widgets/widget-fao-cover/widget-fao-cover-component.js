import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import './widget-fao-cover-styles.scss';

class WidgetFAOCover extends PureComponent {
  render() {
    const { data, sentence } = this.props;

    return (
      <div className="c-widget-fao-cover">
        {!isEmpty(data) && (
          <div>
            {sentence && <WidgetDynamicSentence sentence={sentence} />}
            <div className="pie-chart-container">
              <WidgetPieChartLegend
                className="pie-chart-legend"
                data={data}
                config={{
                  unit: 'ha',
                  format: '.3s',
                  key: 'value'
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
  data: PropTypes.array,
  sentence: PropTypes.string
};

export default WidgetFAOCover;
