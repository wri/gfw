import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PieChartLegend from '../../../components/pie-chart-legend';

class WidgetTreeCover extends PureComponent {
  render() {
    const { parsedData, settings } = this.props;

    return parsedData && (
      <PieChartLegend data={parsedData} settings={settings} />
    );
  }
}

WidgetTreeCover.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
