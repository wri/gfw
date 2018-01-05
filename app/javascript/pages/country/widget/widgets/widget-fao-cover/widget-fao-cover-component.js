import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import NoContent from 'components/no-content';
import './widget-fao-cover-styles.scss';

class WidgetFAOCover extends PureComponent {
  render() {
    const { locationNames, loading, data, getSentence } = this.props;

    return (
      <div className="c-widget-fao-cover">
        {loading && <Loader />}
        {!loading &&
          data &&
          data.length === 0 && (
            <NoContent
              message={`No forest cover for ${locationNames.current &&
                locationNames.current.label}`}
              icon
            />
          )}
        {!loading &&
          data &&
          data.length > 0 && (
            <div>
              <WidgetDynamicSentence sentence={getSentence()} />
              <div className="pie-chart-container">
                <WidgetPieChartLegend
                  className="pie-chart-legend"
                  data={data}
                  settings={{
                    unit: '%',
                    format: '.1f',
                    key: 'percentage'
                  }}
                />
                <WidgetPieChart className="cover-pie-chart" data={data} />
              </div>
            </div>
          )}
      </div>
    );
  }
}

WidgetFAOCover.propTypes = {
  locationNames: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetFAOCover;
