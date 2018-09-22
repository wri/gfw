import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
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
      data,
      dataConfig,
      settings,
      sentence,
      Component
    } = this.props;
    const hasData = !isEmpty(data);

    return (
      <div className="container">
        {loading && <Loader className="widget-loader" />}
        {!loading &&
          !error &&
          !hasData && (
            <NoContent message={`No data in selection for ${locationName}`} />
          )}
        {!loading &&
          error && (
            <NoContent message="An error occured while fetching data. Please try again later." />
          )}
        {!error &&
          sentence &&
          hasData && (
            <DynamicSentence className="sentence" sentence={sentence} />
          )}
        {!error &&
          hasData && (
            <Component
              widget={widget}
              data={data}
              config={dataConfig}
              settings={settings}
            />
          )}
      </div>
    );
  };

  render() {
    const {
      widget,
      color,
      active,
      config,
      embed,
      settings,
      options,
      locationName,
      title,
      indicator
    } = this.props;

    return (
      <div
        id={widget}
        className={cx('c-widget', { large: config.large }, { embed })}
        style={{
          ...(active && {
            borderColor: color,
            boxShadow: `0 0px 0px 1px ${color}`
          })
        }}
      >
        <WidgetHeader
          widget={widget}
          config={config}
          settings={settings}
          options={options}
          locationName={locationName}
          title={title}
        />
        {this.renderWidgetBody()}
        <WidgetFooter
          config={config}
          settings={settings}
          indicator={indicator}
        />
      </div>
    );
  }
}

Widget.propTypes = {
  settings: PropTypes.object,
  title: PropTypes.string,
  widget: PropTypes.string,
  color: PropTypes.string,
  options: PropTypes.object,
  config: PropTypes.object,
  locationName: PropTypes.string,
  dataConfig: PropTypes.object,
  embed: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  active: PropTypes.bool,
  indicator: PropTypes.string,
  Component: PropTypes.any,
  sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Widget;
