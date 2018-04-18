import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ComposedChart from 'components/charts/composed-chart';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-fires-styles.scss';

class WidgetFires extends PureComponent {
  render() {
    const { sentence, chartData, chartConfig } = this.props;

    return (
      <div className="c-widget-fires">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {chartData &&
          chartData.length > 1 && (
            <ComposedChart
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
