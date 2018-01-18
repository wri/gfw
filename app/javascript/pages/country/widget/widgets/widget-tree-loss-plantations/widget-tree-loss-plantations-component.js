import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-loss-plantations-styles.scss';

class WidgetTreeLossPlantations extends PureComponent {
  render() {
    const { data, sentence } = this.props;

    return (
      <div className="c-widget-tree-loss-plantations">
        {data && (
          <div className="data-container">
            {sentence && <WidgetDynamicSentence sentence={sentence} />}
            <WidgetBarChart
              className="loss-chart"
              data={data}
              xKey="year"
              yKey="area"
              config={{
                color: '#fe6598',
                tooltip: [
                  {
                    key: 'year',
                    unit: null
                  },
                  {
                    key: 'area',
                    unit: 'ha'
                  },
                  {
                    key: 'percentage',
                    unit: '%'
                  }
                ]
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeLossPlantations.propTypes = {
  data: PropTypes.array,
  sentence: PropTypes.string
};

export default WidgetTreeLossPlantations;
