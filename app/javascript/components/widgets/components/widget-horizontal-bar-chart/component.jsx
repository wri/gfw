import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'components/charts/horizontal-bar-chart';

class WidgetHorizontalBarChart extends PureComponent {
  render() {
    const {
      data,
      settings,
      config,
      setWidgetSettings,
      widget,
      simple
    } = this.props;

    return (
      <HorizontalBarChart
        className="ranked-plantations-chart"
        data={data}
        config={config}
        settings={settings}
        handlePageChange={change =>
          setWidgetSettings({
            value: { page: settings.page + change },
            widget
          })
        }
        simple={simple}
      />
    );
  }
}

WidgetHorizontalBarChart.propTypes = {
  data: PropTypes.array,
  settings: PropTypes.object.isRequired,
  setWidgetSettings: PropTypes.func.isRequired,
  config: PropTypes.object,
  widget: PropTypes.string,
  simple: PropTypes.bool
};

export default WidgetHorizontalBarChart;
