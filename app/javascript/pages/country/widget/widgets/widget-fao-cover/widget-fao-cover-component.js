import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/loader/loader';
import WidgetHeader from 'pages/country/widget/components/widget-header';
import WidgetDynamicSentence from 'pages/country/widget/components/widget-dynamic-sentence';
import WidgetPieChart from 'pages/country/widget/components/widget-pie-chart';
import WidgetPieChartLegend from 'pages/country/widget/components/widget-pie-chart-legend';
import NoContent from 'components/no-content';
import './widget-fao-cover-styles.scss';

class WidgetFAOCover extends PureComponent {
  render() {
    const {
      locationNames,
      isLoading,
      data,
      getSentence,
      title,
      anchorLink,
      widget
    } = this.props;

    return (
      <div className="c-widget c-widget-fao-cover">
        <WidgetHeader
          widget={widget}
          title={title}
          anchorLink={anchorLink}
          locationNames={locationNames}
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

WidgetFAOCover.propTypes = {
  locationNames: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  getSentence: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  anchorLink: PropTypes.string.isRequired,
  widget: PropTypes.string.isRequired
};

export default WidgetFAOCover;
