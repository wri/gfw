import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import intersection from 'lodash/intersection';
import cx from 'classnames';
import { track } from 'app/analytics';
import moment from 'moment';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';
import DynamicSentence from 'components/ui/dynamic-sentence';

import WidgetHeader from './components/widget-header';
import WidgetFooter from './components/widget-footer';

import './styles.scss';

class Widget extends PureComponent {
  componentDidMount() {
    const { active, config } = this.props;
    if (active && config && config.datasets) {
      this.syncWidgetWithMap();
    }
  }

  componentDidUpdate(prevProps) {
    const { active, settings, config } = this.props;
    if (active) {
      const mapSyncKeys = [
        'startYear',
        'endYear',
        'threshold',
        'extentYear',
        'forestType',
        'landCategory'
      ];
      if (
        config &&
        config.datasets &&
        intersection(mapSyncKeys, Object.keys(settings).length) &&
        settings !== prevProps.settings
      ) {
        this.syncWidgetWithMap();
      } else {
        this.clearMap();
      }
    }
  }

  syncWidgetWithMap = () => {
    // if active widget settings change, send them to the layer
    const { setMapSettings, settings, config, polynames, options } = this.props;
    const {
      startYear,
      endYear,
      threshold,
      extentYear,
      weeks,
      year,
      latestDate,
      ifl
    } =
      settings || {};

    const widgetDatasets = config.datasets.map(d => ({
      ...d,
      opacity: 1,
      visibility: true,
      layers:
        extentYear && !Array.isArray(d.layers)
          ? [d.layers[extentYear]]
          : d.layers,
      ...(((startYear && endYear) || year) && {
        timelineParams: {
          startDate: `${startYear || year}-01-01`,
          endDate: `${endYear || year}-12-31`,
          trimEndDate: `${endYear || year}-12-31`
        }
      }),
      ...(weeks && {
        timelineParams: {
          startDate: moment(latestDate || null)
            .subtract(weeks, 'weeks')
            .format('YYYY-MM-DD'),
          endDate: moment(latestDate || null).format('YYYY-MM-DD'),
          trimEndDate: moment(latestDate || null).format('YYYY-MM-DD')
        }
      }),
      ...(threshold && {
        params: {
          thresh: threshold,
          visibility: true
        }
      })
    }));

    const iflYear =
      options && options.ifl && options.ifl.find(opt => opt.value === ifl);

    const polynameDatasets =
      (polynames &&
        polynames.length &&
        polynames.flatMap(
          polyname =>
            polyname.datasets &&
            polyname.datasets.map(d => ({
              opacity: 0.7,
              visibility: 1,
              ...d,
              sqlParams: iflYear && {
                where: {
                  class: iflYear.layerValue
                }
              }
            }))
        )) ||
      [];

    const datasets = [
      {
        dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
        layers: [
          '6f6798e6-39ec-4163-979e-182a74ca65ee',
          'c5d1e010-383a-4713-9aaa-44f728c0571c'
        ],
        opacity: 1,
        visibility: true
      },
      ...polynameDatasets,
      ...widgetDatasets
    ];

    setMapSettings({
      datasets
    });
  };

  clearMap = () => {
    const { setMapSettings } = this.props;
    setMapSettings({
      datasets: [
        {
          dataset: 'fdc8dc1b-2728-4a79-b23f-b09485052b8d',
          layers: [
            '6f6798e6-39ec-4163-979e-182a74ca65ee',
            'c5d1e010-383a-4713-9aaa-44f728c0571c'
          ],
          opacity: 1,
          visibility: true
        }
      ]
    });
  };

  renderWidgetBody = () => {
    const {
      widget,
      loading,
      error,
      locationName,
      setWidgetsSettings,
      setWidgetSettings,
      setWidgetLoading,
      handleDataHighlight,
      data,
      dataConfig,
      settings,
      sentence,
      Component,
      parsePayload,
      simple,
      config
    } = this.props;
    const hasData = !isEmpty(data);

    return (
      <div className="container">
        {loading && <Loader className="widget-loader" />}
        {!loading &&
          !error &&
          !hasData &&
          Component && (
          <NoContent message={`No data in selection for ${locationName}`} />
        )}
        {!loading &&
          error && (
          <RefreshButton
            refetchFn={() => {
              setWidgetLoading({ widget, loading: false, error: false });
              track('refetchDataBtn', {
                label: `Widget: ${widget}`
              });
            }}
          />
        )}
        {!error &&
          sentence &&
          hasData && (
          <DynamicSentence
            className="sentence"
            sentence={sentence}
            handleMouseOver={() => handleDataHighlight(true, widget)}
            handleMouseOut={() => handleDataHighlight(false, widget)}
          />
        )}
        {!error &&
          hasData &&
          Component && (
          <Component
            widget={widget}
            data={data}
            config={dataConfig}
            settings={settings}
            setWidgetsSettings={setWidgetsSettings}
            setWidgetSettings={setWidgetSettings}
            parsePayload={parsePayload}
            simple={simple}
            layers={config.layers}
          />
        )}
      </div>
    );
  };

  render() {
    const { widget, colors, active, config, embed, simple } = this.props;

    return (
      <div
        id={widget}
        className={cx(
          'c-widget',
          { large: config.large },
          { embed },
          { simple }
        )}
        style={{
          ...(active &&
            !simple &&
            !embed && {
            borderColor: colors && colors.main,
            boxShadow: `0 0px 0px 1px ${colors && colors.main}`
          })
        }}
      >
        <WidgetHeader {...this.props} />
        {this.renderWidgetBody()}
        <WidgetFooter {...this.props} />
      </div>
    );
  }
}

Widget.propTypes = {
  settings: PropTypes.object,
  simple: PropTypes.bool,
  title: PropTypes.string,
  widget: PropTypes.string,
  colors: PropTypes.object,
  options: PropTypes.object,
  config: PropTypes.object,
  locationName: PropTypes.string,
  dataConfig: PropTypes.object,
  embed: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  active: PropTypes.bool,
  indicator: PropTypes.object,
  Component: PropTypes.any,
  parsePayload: PropTypes.func,
  setWidgetsSettings: PropTypes.func,
  setWidgetLoading: PropTypes.func,
  handleDataHighlight: PropTypes.func,
  setMapSettings: PropTypes.func,
  setWidgetSettings: PropTypes.func,
  sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  polynames: PropTypes.array
};

export default Widget;
