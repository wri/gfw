import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const { data, config, sentence } = this.props;

    return (
      <div className="c-widget-tree-loss">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <WidgetBarChart className="loss-chart" data={data} config={config} />
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
