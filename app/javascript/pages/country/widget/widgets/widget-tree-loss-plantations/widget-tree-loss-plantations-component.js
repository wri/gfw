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
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {data && (
          <WidgetBarChart
            className="loss-chart"
            data={data}
            xKey="year"
            yKeys={['areaLoss', 'outsideAreaLoss']}
            config={{
              colors: {
                areaLoss: '#fe6598',
                outsideAreaLoss: '#FFC2E4'
              },
              unit: 'ha',
              tooltip: [
                {
                  key: 'outsideAreaLoss',
                  unit: 'ha',
                  label: 'outsideLossLabel'
                },
                {
                  key: 'areaLoss',
                  unit: 'ha',
                  label: 'lossLabel'
                }
              ]
            }}
          />
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
