import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetGladAlertsChart from 'pages/country/widget/components/widget-glad-alerts-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-glad-alerts-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const { data, config, sentence } = this.props;

    return (
      <div className="c-widget-glad-alerts">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <WidgetGladAlertsChart
            className="loss-chart"
            data={data}
            config={config}
          />
        )}
      </div>
    );
  }
}

WidgetTreeLoss.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  sentence: PropTypes.string
};

export default WidgetTreeLoss;
