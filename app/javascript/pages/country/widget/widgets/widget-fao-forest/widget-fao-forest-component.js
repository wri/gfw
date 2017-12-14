import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
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
        {isLoading ? (
          <Loader className="loader-offset" />
        ) : (
          <div>
            <div
              className="sentence"
              dangerouslySetInnerHTML={getSentence(this.props)} // eslint-disable-line
            />
            <div className="pie-chart-container">
              <WidgetPieChartLegend
                data={data}
                settings={{
                  unit: '%'
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

WidgetFAOForestGain.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired
};

export default WidgetFAOForestGain;
