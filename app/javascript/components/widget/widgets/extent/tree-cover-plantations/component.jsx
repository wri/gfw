import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PieChartLegend from '../../../components/pie-chart-legend';

class WidgetTreeCoverPlantations extends PureComponent {
  render() {
    const { parsedData, settings } = this.props;

    return (
      parsedData && <PieChartLegend data={parsedData} settings={settings} />
    );
  }
}

WidgetTreeCoverPlantations.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired
};

export default WidgetTreeCoverPlantations;
