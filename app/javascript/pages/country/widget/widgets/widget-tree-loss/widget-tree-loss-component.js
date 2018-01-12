import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const { data, getSentence } = this.props;

    return (
      <div className="c-widget-tree-loss">
        {data &&
          data.length > 0 && (
            <div className="data-container">
              <WidgetDynamicSentence sentence={getSentence()} />
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

WidgetTreeLoss.propTypes = {
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetTreeLoss;
