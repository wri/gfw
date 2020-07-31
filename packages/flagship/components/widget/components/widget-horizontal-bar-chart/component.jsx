import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'components/charts/horizontal-bar-chart';

class WidgetHorizontalBarChart extends PureComponent {
  render() {
    const { data, settings, config, handleChangeSettings, simple } = this.props;

    return (
      <HorizontalBarChart
        className="ranked-plantations-chart"
        data={data}
        config={config}
        settings={settings}
        handlePageChange={change =>
          handleChangeSettings({ page: settings.page + change })
        }
        simple={simple}
      />
    );
  }
}

WidgetHorizontalBarChart.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  handleChangeSettings: PropTypes.func.isRequired,
  config: PropTypes.object,
  simple: PropTypes.bool
};

export default WidgetHorizontalBarChart;
