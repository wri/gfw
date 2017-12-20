import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import NoContent from 'components/no-content';
import './widget-fao-forest-styles.scss';

class WidgetFAOForestGain extends PureComponent {
  render() {
    const { locationNames, isLoading, data, getSentence } = this.props;

    return (
      <div className="c-widget c-widget-fao-forest">
        <WidgetHeader
          title={`Forest cover in ${locationNames.current &&
            locationNames.current.label}`}
          shareAnchor={'fao-forest'}
        />
        <div className="container">
          {isLoading && <Loader />}
          {!isLoading &&
            data &&
            data.length === 0 && (
              <NoContent
                message={`No forest cover for ${locationNames.current &&
                  locationNames.current.label}`}
                icon
              />
            )}
          {!isLoading &&
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
      </div>
    );
  }
}

WidgetFAOForestGain.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetFAOForestGain;
