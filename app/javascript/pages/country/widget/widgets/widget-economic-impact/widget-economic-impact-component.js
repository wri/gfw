import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetComposedChart from 'pages/country/widget/components/widget-composed-chart';
import WidgetNumberedList from 'pages/country/widget/components/widget-numbered-list';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-economic-impact-styles.scss';

class WidgetEconomicImpact extends PureComponent {
  render() {
    const { chartData, chartConfig, rankData, sentence, settings } = this.props;
    return (
      <div className="c-widget-economic-impact">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        <div className="locations-container">
          {chartData && (
            <WidgetComposedChart
              className="economic-impact-chart"
              data={chartData}
              config={chartConfig}
            />
          )}
          {rankData && (
            <WidgetNumberedList
              className="locations-list"
              data={rankData}
              settings={{
                ...settings,
                unit: settings.unit === 'net_perc' ? '%' : ''
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

WidgetEconomicImpact.propTypes = {
  chartData: PropTypes.array,
  chartConfig: PropTypes.object,
  rankData: PropTypes.array,
  sentence: PropTypes.string,
  settings: PropTypes.object
};

export default WidgetEconomicImpact;
