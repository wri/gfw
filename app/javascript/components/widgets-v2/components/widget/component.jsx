import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';

import Loader from 'components/ui/loader/loader';
import NoContent from 'components/ui/no-content';
import Button from 'components/ui/button';
import DynamicSentence from 'components/ui/dynamic-sentence';

import WidgetHeader from './components/widget-header';
import WidgetFooter from './components/widget-footer';

import './styles.scss';

class Widget extends PureComponent {
  renderWidgetBody = () => {
    const { loading, error, locationName, data, dataConfig, settings, sentence, Component } = this.props;
    const hasData = !isEmpty(data);

    return (
      <div className="container">
        {loading && <Loader />}
        {!loading && !error && !hasData &&
          <NoContent message={`No data in selection for ${locationName}`} />
        }
        {!loading && error &&
          <NoContent message="An error occured while fetching data. Please try again later." />
        }
        {!error && sentence && hasData &&
          <DynamicSentence
            className="sentence"
            sentence={sentence}
            // onHover={handleDataHighlight}
            // handleMouseOver={() => handleDataHighlight(true, widget)}
            // handleMouseOut={() => handleDataHighlight(false, widget)}
          />
        }
        {!error && hasData &&
          <Component
            data={data}
            config={dataConfig}
            settings={settings}
          />
        }
      </div>
    );
  }

  render() {
    const {
      widget,
      color,
      active,
      config,
      embed,
      settings,
      options
    } = this.props;
    return (
      <div
        id={widget}
        className={cx('c-widget', { large: config.large }, { embed })}
        style={{ ...active && { borderColor: color, boxShadow: `0 0px 0px 1px ${color}` } }}
      >
        <WidgetHeader
          widget={widget}
          config={config}
          settings={settings}
          options={options}
        />
        {this.renderWidgetBody()}
        <WidgetFooter
          config={config}
          settings={settings}
        />
      </div>
    );
  }
}

Widget.propTypes = {
  // widget: PropTypes.string.isRequired,
  // title: PropTypes.object.isRequired,
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
  handleDataHighlight: PropTypes.func,
  sentence: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parsedData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  parsedConfig: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Widget;
