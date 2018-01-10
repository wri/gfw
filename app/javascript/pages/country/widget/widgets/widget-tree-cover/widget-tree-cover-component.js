import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import NoContent from 'components/no-content';

import './widget-tree-cover-styles.scss';

class WidgetTreeCover extends PureComponent {
  render() {
    const { loading, data, settings, locationNames } = this.props;

    return (
      <div className="c-widget-tree-cover">
        {!loading &&
          data &&
          data.length === 0 && (
            <NoContent
              message={`No data in selection for ${locationNames.current &&
                locationNames.current.label}`}
            />
          )}
        {!loading &&
          data && (
            <div className="pie-chart-container">
              <WidgetPieChartLegend
                data={data}
                config={{
                  ...settings,
                  format: '.3s',
                  unit: 'ha',
                  key: 'value'
                }}
              />
              <WidgetPieChart className="cover-pie-chart" data={data} />
            </div>
          )}
      </div>
    );
  }
}

WidgetTreeCover.propTypes = {
  loading: PropTypes.bool.isRequired,
  locationNames: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default WidgetTreeCover;
