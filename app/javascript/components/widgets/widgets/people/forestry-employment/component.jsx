import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import NoContent from 'components/ui/no-content';
import WidgetPieChartLegend from 'components/widgets/components/widget-pie-chart-legend';

class WidgetForestryEmployment extends PureComponent {
  render() {
    const { data } = this.props;
    return data ? (
      <WidgetPieChartLegend {...this.props} />
    ) : (
      <NoContent message="No gender data available" />
    );
  }
}

WidgetForestryEmployment.propTypes = {
  data: PropTypes.array
};
export default WidgetForestryEmployment;
