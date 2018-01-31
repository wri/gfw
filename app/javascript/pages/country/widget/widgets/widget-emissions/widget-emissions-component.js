import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetComposedChart from 'pages/country/widget/components/widget-composed-chart';

import './widget-emissions-styles.scss';

class WidgetEmissions extends PureComponent {
  render() {
    const { sentence, chartData, chartConfig } = this.props;

    return (
      <div className="c-widget-emissions">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {chartData && (
          <WidgetComposedChart
            className="emissions-chart"
            data={chartData}
            config={chartConfig}
          />
        )}
      </div>
    );
  }
}

WidgetEmissions.propTypes = {
  sentence: PropTypes.string,
  chartData: PropTypes.array,
  chartConfig: PropTypes.object
};

export default WidgetEmissions;
