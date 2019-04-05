import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import RefreshButton from 'components/ui/refresh-button';
import DynamicSentence from 'components/ui/dynamic-sentence';

import WidgetHeader from './components/widget-header';
import WidgetFooter from './components/widget-footer';

import './styles.scss';

class Widget extends PureComponent {
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
              refetchFn={() =>
                setWidgetLoading({ widget, loading: false, error: false })
              }
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
              borderColor: colors.main,
              boxShadow: `0 0px 0px 1px ${colors.main}`
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
  setWidgetSettings: PropTypes.func,
  sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Widget;
