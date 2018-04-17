import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-tree-cover-plantations-styles.scss';

class WidgetTreeCoverPlantations extends PureComponent {
  render() {
    const { parsedData, settings, sentence } = this.props;

    return (
      <div className="c-widget-tree-cover-plantations">
        {parsedData && (
          <div>
            <WidgetDynamicSentence sentence={sentence} />
            <div className="pie-chart-container">
              <PieChartLegend
                className="cover-legend"
                data={parsedData}
                config={{
                  ...settings,
                  format: '.3s',
                  unit: 'ha',
                  key: 'value'
                }}
              />
              <PieChart
                className="cover-pie-chart"
                data={parsedData}
                maxSize={140}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

WidgetTreeCoverPlantations.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired,
  sentence: PropTypes.string
};

export default WidgetTreeCoverPlantations;
