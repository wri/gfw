import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetComposedChart from 'pages/country/widget/components/widget-composed-chart';

import './widget-emissions-deforestation-styles.scss';

class WidgetEmissionsDeforestation extends PureComponent {
  render() {
    const { sentence, chartData, chartConfig } = this.props;

    return (
      <div className="c-widget-emissions-deforestation">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {chartData && (
          <WidgetComposedChart
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
