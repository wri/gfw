import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PieChart from 'components/charts/pie-chart';
import PieChartLegend from 'components/charts/components/pie-chart-legend';
import WidgetDynamicSentence from '../../components/widget-dynamic-sentence';

import './widget-forestry-employment-styles.scss';

class WidgetForestryEmployment extends PureComponent {
  render() {
    const { charData, settings, sentence } = this.props;

    return (
      <div className="c-widget-forestry-employment">
        {sentence && <WidgetDynamicSentence sentence={sentence} />}
        {charData && (
          <div className="pie-chart-container">
            <PieChartLegend
              className="fao-legend"
              data={charData}
              config={{
                ...settings,
                format: '.3s',
                unit: '',
                key: 'value'
              }}
            />
            <PieChart
              className="cover-pie-chart"
              data={charData}
              maxSize={140}
            />
          </div>
        )}
      </div>
    );
  }
}

WidgetForestryEmployment.propTypes = {
  charData: PropTypes.array,
  settings: PropTypes.object.isRequired,
  sentence: PropTypes.string.isRequired
};

export default WidgetForestryEmployment;
