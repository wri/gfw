import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetHorizontalBarChart from 'pages/country/widget/components/widget-horizontal-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-ranked-plantations-styles.scss';

class WidgetRankedPlantations extends PureComponent {
  render() {
    const { data, config, settings, sentence, handlePageChange } = this.props;

    return (
      <div className="c-widget-ranked-plantations">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <WidgetHorizontalBarChart
            className="ranked-plantations-chart"
            data={data}
            config={config}
            settings={settings}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    );
  }
}

WidgetRankedPlantations.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
  settings: PropTypes.object,
  sentence: PropTypes.string,
  handlePageChange: PropTypes.func
};

export default WidgetRankedPlantations;
