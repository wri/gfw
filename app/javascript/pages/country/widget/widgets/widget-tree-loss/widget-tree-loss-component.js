import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import NoContent from 'components/no-content';
import WidgetBarChart from 'pages/country/widget/components/widget-bar-chart';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';

import './widget-tree-loss-styles.scss';

class WidgetTreeLoss extends PureComponent {
  render() {
    const { loading, data, getSentence, locationNames } = this.props;

    return (
      <div className="c-widget-tree-loss">
        {loading && <Loader />}
        {!loading &&
          data &&
          data.length === 0 && (
            <NoContent
              message={`No loss data for ${locationNames.current &&
                locationNames.current.label}`}
              icon
            />
          )}
        {data &&
          data.length > 0 && (
            <div className="data-container">
              <WidgetDynamicSentence sentence={getSentence()} />
              <WidgetBarChart
                className="loss-chart"
                data={data}
                xKey="year"
                yKey="area"
                config={{
                  color: '#fe6598',
                  tooltip: [
                    {
                      key: 'year',
                      unit: null
                    },
                    {
                      key: 'area',
                      unit: 'ha'
                    },
                    {
                      key: 'percentage',
                      unit: '%'
                    }
                  ]
                }}
              />
            </div>
          )}
      </div>
    );
  }
}

WidgetTreeLoss.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired,
  locationNames: PropTypes.object
};

export default WidgetTreeLoss;
