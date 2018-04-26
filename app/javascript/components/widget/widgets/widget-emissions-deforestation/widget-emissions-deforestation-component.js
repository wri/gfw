import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ComposedChart from 'components/charts/composed-chart';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-emissions-deforestation-styles.scss';

class WidgetEmissionsDeforestation extends PureComponent {
  render() {
    const { sentence, chartData, chartConfig } = this.props;

    return (
      <div className="c-widget-emissions-deforestation">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {chartData && (
          <ComposedChart
            className="emissions-deforestation-chart"
            data={chartData}
            config={chartConfig}
          />
        )}
      </div>
    );
  }
}

WidgetEmissionsDeforestation.propTypes = {
  sentence: PropTypes.string,
  chartData: PropTypes.array,
  chartConfig: PropTypes.object
};

export default WidgetEmissionsDeforestation;
