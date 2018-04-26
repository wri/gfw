import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ComposedChart from 'components/charts/composed-chart';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-tree-loss-plantations-styles.scss';

class WidgetTreeLossPlantations extends PureComponent {
  render() {
    const { data, config, sentence } = this.props;

    return (
      <div className="c-widget-tree-loss-plantations">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <ComposedChart className="loss-chart" data={data} config={config} />
        )}
      </div>
    );
  }
}

WidgetTreeLossPlantations.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  sentence: PropTypes.string
};

export default WidgetTreeLossPlantations;
