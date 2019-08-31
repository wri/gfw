import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import WidgetHeader from './components/widget-header';
import WidgetBody from './components/widget-body';
import WidgetFooter from './components/widget-footer';

import './styles.scss';

class Widget extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool,
    embed: PropTypes.bool,
    large: PropTypes.bool,
    colors: PropTypes.object.isRequired,
    simple: PropTypes.bool,
    datasets: PropTypes.array,
    settings: PropTypes.object,
    options: PropTypes.array,
    chartType: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    locationName: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    config: PropTypes.object,
    sentence: PropTypes.object,
    statements: PropTypes.array,
    showAttributionLink: PropTypes.bool,
    handleShowMap: PropTypes.func,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowShare: PropTypes.func,
    handleRefetchData: PropTypes.func,
    handleMouseOver: PropTypes.func,
    handleMouseOut: PropTypes.func
  };

  render() {
    const {
      title,
      widget,
      colors,
      active,
      large,
      embed,
      simple,
      datasets,
      settings,
      options,
      chartType,
      loading,
      error,
      locationName,
      data,
      config,
      sentence,
      statements,
      showAttributionLink,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare,
      handleRefetchData,
      handleMouseOver,
      handleMouseOut
    } = this.props;
    const { main } = colors || {};
    console.log(this.props);
    return (
      <div
        id={widget}
        className={cx('c-widget', { large }, { embed }, { simple })}
        style={{
          ...(active &&
            !simple &&
            !embed && {
            borderColor: main,
            boxShadow: `0 0px 0px 1px ${main}`
          })
        }}
      >
        <WidgetHeader
          title={title}
          large={large}
          datasets={datasets}
          active={active}
          embed={embed}
          options={options}
          handleShowMap={handleShowMap}
          handleShowInfo={handleShowInfo}
          handleChangeSettings={handleChangeSettings}
          handleShowShare={handleShowShare}
        />
        <WidgetBody
          chartType={chartType}
          loading={loading}
          error={error}
          simple={simple}
          locationName={locationName}
          data={data}
          settings={settings}
          sentence={sentence}
          config={config}
          handleRefetchData={handleRefetchData}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
        />
        <WidgetFooter
          statements={statements}
          simple={simple}
          showAttributionLink={showAttributionLink}
        />
      </div>
    );
  }
}

export default Widget;
