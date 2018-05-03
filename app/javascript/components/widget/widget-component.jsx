import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';

import WidgetHeader from './components/widget-header';
import WidgetSettingsStatement from './components/widget-settings-statement';
import WidgetDynamicSentence from './components/widget-dynamic-sentence';

import './widget-styles.scss';

class Widget extends PureComponent {
  render() {
    const {
      widget,
      locationNames,
      payload,
      settings,
      config,
      embed,
      loading,
      error,
      data,
      query,
      onMap,
      highlightColor,
      Component,
      sentence,
      setWidgetSettingsUrl,
      parsedData,
      parsedConfig
    } = this.props;

    return (
      <div
        className={`c-widget ${config.size || ''}`}
        id={widget}
        style={{
          ...(!!onMap && {
            borderColor: highlightColor,
            boxShadow: `0 0px 0px 1px ${highlightColor}`
          }),
          ...(!!embed && {
            border: 0,
            borderRadius: 0
          })
        }}
      >
        <WidgetHeader {...this.props} onSettingsChange={setWidgetSettingsUrl} />
        <div className="container">
          {!loading &&
            !error &&
            isEmpty(data) && (
              <NoContent
                message={`No data in selection for ${locationNames &&
                  locationNames.current &&
                  locationNames.current.label}`}
              />
            )}
          {loading && <Loader />}
          {!loading &&
            error && (
              <NoContent message="An error occured while fetching data. Please try again later." />
            )}
          {!error &&
            sentence &&
            !isEmpty(data) && (
              <WidgetDynamicSentence className="sentence" sentence={sentence} />
            )}
          {!error &&
            !isEmpty(parsedData) && (
              <Component
                {...this.props}
                data={parsedData}
                config={parsedConfig}
              />
            )}
        </div>
        <WidgetSettingsStatement settings={settings} />
        {embed &&
          (!query || (query && !query.hideGfw)) && (
            <div className="embed-footer">
              <p>For more info</p>
              <Button
                className="embed-btn"
                extLink={`http://globalforestwatch.org/country/${
                  payload.country
                }${payload.region ? `/${payload.region}` : ''}${
                  payload.subRegion ? `/${payload.subRegion}` : ''
                }?widget=${widget}${
                  query && query[widget] ? `&${widget}=${query[widget]}` : ''
                }#${widget}`}
              >
                EXPLORE ON GFW
              </Button>
            </div>
          )}
      </div>
    );
  }
}

Widget.propTypes = {
  widget: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setWidgetSettingsUrl: PropTypes.func.isRequired,
  settings: PropTypes.object,
  config: PropTypes.object,
  onMap: PropTypes.bool,
  highlightColor: PropTypes.string,
  locationNames: PropTypes.object,
  payload: PropTypes.object,
  query: PropTypes.object,
  embed: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  active: PropTypes.bool,
  colors: PropTypes.object,
  whitelist: PropTypes.object,
  Component: PropTypes.any,
  sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parsedData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parsedConfig: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Widget;
