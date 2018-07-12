import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import DynamicSentence from 'components/ui/dynamic-sentence';

import WidgetHeader from '../widget-header';
import WidgetFooter from '../widget-footer';

import './styles.scss';

class Widget extends PureComponent {
  render() {
    const {
      widget,
      currentLabel,
      shareUrl,
      config,
      embed,
      minimalist,
      loading,
      error,
      data,
      query,
      onMap,
      highlightColor,
      Component,
      sentence,
      setWidgetSettings,
      parsedData,
      parsedConfig
    } = this.props;

    return (
      <div
        className={`c-widget ${minimalist ? 'large' : config.size || ''}`}
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
        <WidgetHeader {...this.props} onSettingsChange={setWidgetSettings} />
        <div className="container">
          {!loading &&
            !error &&
            isEmpty(data) && (
              <NoContent message={`No data in selection for ${currentLabel}`} />
            )}
          {loading && <Loader />}
          {!loading &&
            error && (
              <NoContent message="An error occured while fetching data. Please try again later." />
            )}
          {!error &&
            sentence &&
            !isEmpty(data) && (
              <DynamicSentence
                className={`sentence ${
                  config.interactive ? 'interactive' : ''
                }`}
                sentence={sentence}
              />
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
        {!minimalist && <WidgetFooter {...this.props} />}
        {embed &&
          (!query || (query && !query.hideGfw)) && (
            <div className="embed-footer">
              <p>For more info</p>
              <Button className="embed-btn" extLink={shareUrl}>
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
  title: PropTypes.object.isRequired,
  setWidgetSettings: PropTypes.func.isRequired,
  settings: PropTypes.object,
  config: PropTypes.object,
  onMap: PropTypes.bool,
  highlightColor: PropTypes.string,
  currentLabel: PropTypes.string,
  shareUrl: PropTypes.string,
  query: PropTypes.object,
  embed: PropTypes.bool,
  minimalist: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  active: PropTypes.bool,
  colors: PropTypes.object,
  whitelist: PropTypes.array,
  Component: PropTypes.any,
  sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parsedData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parsedConfig: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Widget;
