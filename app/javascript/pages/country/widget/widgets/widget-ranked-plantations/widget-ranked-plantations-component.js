import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetBarChart from 'pages/country/widget/components/widget-horizontal-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-ranked-plantations-styles.scss';

class WidgetRankedPlantations extends PureComponent {
  render() {
    const { data, config, sentence } = this.props;

    return (
      <div className="c-widget-ranked-plantations">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <WidgetBarChart
            className="ranked-plantations-chart"
            data={data}
            config={config}
          />
        )}
      </div>
    );
  }
}

WidgetRankedPlantations.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  sentence: PropTypes.string
};

export default WidgetRankedPlantations;
