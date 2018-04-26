import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import HorizontalBarChart from 'components/charts/horizontal-bar-chart';

class WidgetHorizontalBarChart extends PureComponent {
  render() {
    const {
      parsedData,
      settings,
      config,
      setWidgetSettingsUrl,
      widget
    } = this.props;

    return (
      <HorizontalBarChart
        className="ranked-plantations-chart"
        data={parsedData}
        config={config}
        settings={settings}
        handlePageChange={change =>
          setWidgetSettingsUrl({
            value: { page: settings.page + change },
            widget
          })
        }
      />
    );
  }
}

WidgetHorizontalBarChart.propTypes = {
  parsedData: PropTypes.array,
  settings: PropTypes.object.isRequired,
  setWidgetSettingsUrl: PropTypes.func.isRequired,
  config: PropTypes.object,
  widget: PropTypes.string
};

export default WidgetHorizontalBarChart;
