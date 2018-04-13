import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { formatUSD } from 'utils/format';
import ComposedChart from 'components/charts/composed-chart';
import NumberedList from 'components/numbered-list';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-economic-impact-styles.scss';

class WidgetEconomicImpact extends PureComponent {
  render() {
    const {
      chartData,
      chartConfig,
      rankData,
      sentence,
      settings,
      embed
    } = this.props;

    return (
      <div className="c-widget-economic-impact">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        <div className="locations-container">
          {chartData && (
            <ComposedChart
              className="economic-impact-chart"
              data={chartData}
              config={chartConfig}
            />
          )}
          {rankData && (
            <NumberedList
              className="locations-list"
              data={rankData}
              settings={{
                ...settings,
                unit: settings.unit === 'net_perc' ? '%' : ' $',
                unitFormat:
                  settings.unit !== 'net_perc'
                    ? value => formatUSD(value)
                    : null
              }}
              linkExt={embed}
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
  settings: PropTypes.object,
  embed: PropTypes.bool
};

export default WidgetEconomicImpact;
