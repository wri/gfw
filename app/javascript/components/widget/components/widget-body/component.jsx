import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';
import DynamicSentence from 'components/ui/dynamic-sentence';
import WidgetComposedChart from 'components/widget/components/widget-composed-chart';
import WidgetHorizontalBarChart from 'components/widget/components/widget-horizontal-bar-chart';
import WidgetNumberedList from 'components/widget/components/widget-numbered-list';
import WidgetPieChartLegend from 'components/widget/components/widget-pie-chart-legend';

import './styles.scss';

const chartOptions = {
  composedChart: WidgetComposedChart,
  horizontalBarChart: WidgetHorizontalBarChart,
  rankedList: WidgetNumberedList,
  pieChart: WidgetPieChartLegend
};

class Widget extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    settings: PropTypes.object,
    config: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    simple: PropTypes.bool,
    chartType: PropTypes.string.isRequired,
    sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    dataConfig: PropTypes.object,
    locationName: PropTypes.string,
    parsePayload: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func,
    handleRefetchData: PropTypes.func
  };

  render() {
    const {
      loading,
      error,
      simple,
      locationName,
      sentence,
      data,
      dataConfig,
      chartType,
      handleRefetchData,
      handleMouseOver,
      handleMouseOut
    } = this.props;
    const hasData = !isEmpty(data);
    const Component = chartOptions[chartType];

    return (
      <div className={cx('c-widget-body', { simple })}>
        {loading && <Loader className="widget-loader" />}
        {!loading &&
          !error &&
          !hasData &&
          Component && (
          <NoContent message={`No data in selection for ${locationName}`} />
        )}
        {!loading &&
          error && (
          <RefreshButton refetchFn={handleRefetchData} />
        )}
        {!error &&
          sentence &&
          hasData && (
          <DynamicSentence
            className="sentence"
            sentence={sentence}
            handleMouseOver={handleMouseOver}
            handleMouseOut={handleMouseOut}
          />
        )}
        {!error &&
          hasData &&
          Component && (
          <Component
            {...this.props}
            config={dataConfig}
          />
        )}
      </div>
    );
  }
}

export default Widget;
