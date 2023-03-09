import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';
import DynamicSentence from 'components/ui/dynamic-sentence';
import CustomComponent from 'components/widget/components/widgets-custom';
import WidgetComposedChart from 'components/widget/components/widget-composed-chart';
import WidgetComposedChartAlt from 'components/widget/components/widget-composed-chart-alt';
import WidgetHorizontalBarChart from 'components/widget/components/widget-horizontal-bar-chart';
import WidgetNumberedList from 'components/widget/components/widget-numbered-list';
import WidgetPieChartLegend from 'components/widget/components/widget-pie-chart-legend';
import WidgetChartList from 'components/widget/components/widget-chart-list';
import WidgetChartAndList from 'components/widget/components/widget-chart-and-list';
import WidgetListLegend from 'components/widget/components/widget-list-legend';
import WidgetMapList from 'components/widget/components/widget-map-list';
import WidgetSankey from 'components/widget/components/widget-sankey';
import WidgetLollipop from 'components/widget/components/widget-lollipop';
import WidgetInfoList from 'components/widget/components/widget-info-list';

// import './styles.scss';

const chartOptions = {
  composedChart: WidgetComposedChart,
  composedChartAlt: WidgetComposedChartAlt,
  horizontalBarChart: WidgetHorizontalBarChart,
  rankedList: WidgetNumberedList,
  pieChart: WidgetPieChartLegend,
  chartList: WidgetChartList,
  chartAndList: WidgetChartAndList,
  mapList: WidgetMapList,
  sankey: WidgetSankey,
  listLegend: WidgetListLegend,
  lollipop: WidgetLollipop,
  infoList: WidgetInfoList,
};

class WidgetBody extends PureComponent {
  static propTypes = {
    widget: PropTypes.string,
    location: PropTypes.object,
    settings: PropTypes.object,
    loading: PropTypes.bool,
    metaLoading: PropTypes.bool,
    error: PropTypes.bool,
    simple: PropTypes.bool,
    large: PropTypes.bool,
    autoHeight: PropTypes.bool,
    embed: PropTypes.bool,
    chartType: PropTypes.string,
    sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    customComponent: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    rawData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    locationName: PropTypes.string,
    parsePayload: PropTypes.func,
    handleDataHighlight: PropTypes.func,
    handleRefetchData: PropTypes.func,
  };

  render() {
    const {
      widget,
      loading,
      metaLoading,
      error,
      simple,
      autoHeight,
      locationName,
      sentence,
      data,
      rawData,
      customComponent,
      chartType,
      handleRefetchData,
      handleDataHighlight,
    } = this.props;

    const hasData = !isEmpty(data);
    const hasRawData = !isEmpty(rawData);
    const hasSentence = !isEmpty(sentence);
    const hasCustomComponent = !isEmpty(customComponent);
    const Component = chartOptions[chartType];

    return (
      <div
        className={cx('c-widget-body', { simple, '-auto-height': autoHeight })}
      >
        {(loading || metaLoading) && <Loader className="widget-loader" />}
        {!loading &&
          !metaLoading &&
          !error &&
          !hasData &&
          !hasSentence &&
          Component && (
            <NoContent
              message={`No data in selection for ${
                locationName || 'selected area'
              }`}
            />
          )}
        {!loading && error && <RefreshButton refetchFn={handleRefetchData} />}
        {!error && !metaLoading && sentence && hasSentence && (
          <DynamicSentence
            className="sentence"
            testId={`sentence-${widget}`}
            sentence={sentence}
            handleMouseOver={() => handleDataHighlight(true)}
            handleMouseOut={() => handleDataHighlight(false)}
          />
        )}
        {!error &&
          hasData &&
          !metaLoading &&
          hasRawData &&
          hasCustomComponent && <CustomComponent type={customComponent} />}
        {!error && hasData && !metaLoading && hasRawData && Component && (
          <Component {...this.props} />
        )}
      </div>
    );
  }
}

export default WidgetBody;
