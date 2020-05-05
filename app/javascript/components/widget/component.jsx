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
    colors: PropTypes.object,
    simple: PropTypes.bool,
    datasets: PropTypes.array,
    settings: PropTypes.object,
    settingsConfig: PropTypes.array,
    chartType: PropTypes.string,
    metaKey: PropTypes.string,
    loading: PropTypes.bool,
    metaLoading: PropTypes.bool,
    error: PropTypes.bool,
    locationLabelFull: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    originalData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rawData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    config: PropTypes.object,
    sentence: PropTypes.object,
    handleShowMap: PropTypes.func,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleDataHighlight: PropTypes.func,
    handleShowShare: PropTypes.func,
    parseInteraction: PropTypes.func,
    handleRefetchData: PropTypes.func,
    preventCloseSettings: PropTypes.bool,
    showAttribution: PropTypes.bool,
    statements: PropTypes.array,
    getDataURL: PropTypes.func,
    onClickWidget: PropTypes.func,
    parentData: PropTypes.object,
    locationData: PropTypes.object,
    childData: PropTypes.object,
    location: PropTypes.object,
    adminLevel: PropTypes.string,
    preventRenderKeys: PropTypes.array,
    geostore: PropTypes.object
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
      settingsConfig,
      chartType,
      loading,
      metaLoading,
      error,
      locationLabelFull,
      data,
      rawData,
      originalData,
      config,
      sentence,
      metaKey,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare,
      handleRefetchData,
      handleDataHighlight,
      parseInteraction,
      preventCloseSettings,
      showAttribution,
      statements,
      getDataURL,
      onClickWidget,
      parentData,
      childData,
      adminLevel,
      locationData,
      location,
      preventRenderKeys,
      geostore
    } = this.props;
    const { main } = colors || {};

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
        onClick={() => onClickWidget(this.props)}
      >
        <WidgetHeader
          widget={widget}
          title={title}
          large={large}
          datasets={datasets}
          active={active}
          embed={embed}
          settingsConfig={settingsConfig}
          metaKey={metaKey}
          simple={simple}
          status={status}
          handleShowMap={handleShowMap}
          handleShowInfo={handleShowInfo}
          handleChangeSettings={handleChangeSettings}
          handleShowShare={handleShowShare}
          preventCloseSettings={preventCloseSettings}
          getDataURL={getDataURL}
          settings={settings}
          parentData={parentData}
          childData={childData}
          adminLevel={adminLevel}
          locationData={locationData}
          location={location}
          geostore={geostore}
        />
        <WidgetBody
          chartType={chartType}
          loading={loading}
          metaLoading={metaLoading}
          error={error}
          simple={simple}
          locationName={locationLabelFull}
          active={active}
          data={data}
          rawData={rawData}
          originalData={originalData}
          settings={settings}
          preventRenderKeys={preventRenderKeys}
          sentence={sentence}
          config={config}
          handleRefetchData={handleRefetchData}
          handleDataHighlight={handleDataHighlight}
          handleChangeSettings={handleChangeSettings}
          parseInteraction={parseInteraction}
        />
        {sentence &&
          data && (
          <WidgetFooter
            showAttribution={showAttribution}
            statements={statements}
            simple={simple}
          />
        )}
      </div>
    );
  }
}

export default Widget;
