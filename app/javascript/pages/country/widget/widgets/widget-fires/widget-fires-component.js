import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetComposedChart from 'pages/country/widget/components/widget-composed-chart';

import './widget-fires-styles.scss';

class WidgetFires extends PureComponent {
  render() {
    const { sentence, chartData, chartConfig } = this.props;

    return (
      <div className="c-widget-fires">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {chartData && (
          <WidgetComposedChart
            className="fires-chart"
            data={chartData}
            config={chartConfig}
          />
        )}
      </div>
    );
  }
}

WidgetFires.propTypes = {
  sentence: PropTypes.string,
  chartData: PropTypes.array,
  chartConfig: PropTypes.object
};

export default WidgetFires;
