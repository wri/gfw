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
    type: PropTypes.string,
    active: PropTypes.bool,
    downloadDisabled: PropTypes.bool,
    filterSelected: PropTypes.bool,
    maxSize: PropTypes.number,
    embed: PropTypes.bool,
    large: PropTypes.bool,
    colors: PropTypes.object,
    simple: PropTypes.bool,
    caution: PropTypes.object,
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
    legendData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    originalData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rawData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    config: PropTypes.object,
    sentence: PropTypes.object,
    proxy: PropTypes.bool,
    proxyOn: PropTypes.array,
    handleShowMap: PropTypes.func,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleSetInteraction: PropTypes.func,
    handleDataHighlight: PropTypes.func,
    handleShowShare: PropTypes.func,
    parseInteraction: PropTypes.func,
    handleRefetchData: PropTypes.func,
    preventCloseSettings: PropTypes.bool,
    showAttributionLink: PropTypes.bool,
    statements: PropTypes.array,
    getDataURL: PropTypes.func,
    onClickWidget: PropTypes.func,
    parentData: PropTypes.object,
    locationData: PropTypes.object,
    childData: PropTypes.object,
    location: PropTypes.object,
    adminLevel: PropTypes.string,
    preventRenderKeys: PropTypes.array,
    geostore: PropTypes.object,
    settingsBtnConfig: PropTypes.object,
    status: PropTypes.string,
    meta: PropTypes.object,
    customComponent: PropTypes.string,
    authenticated: PropTypes.bool,
  };

  state = {
    shouldSettingsOpen: false,
  };

  render() {
    const {
      title,
      widget,
      caution,
      colors,
      type,
      active,
      downloadDisabled,
      filterSelected,
      maxSize,
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
      legendData,
      rawData,
      originalData,
      config,
      sentence,
      metaKey,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleSetInteraction,
      handleShowShare,
      handleRefetchData,
      handleDataHighlight,
      parseInteraction,
      preventCloseSettings,
      showAttributionLink,
      statements,
      getDataURL,
      onClickWidget,
      parentData,
      childData,
      adminLevel,
      locationData,
      location,
      preventRenderKeys,
      geostore,
      settingsBtnConfig,
      status,
      meta,
      proxy,
      proxyOn,
      customComponent,
      authenticated,
    } = this.props;

    const { main } = colors || {};
    const toggleSettingsMenu = () =>
      this.setState({ shouldSettingsOpen: !this.state.shouldSettingsOpen });
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
              boxShadow: `0 0px 0px 1px ${main}`,
            }),
        }}
        onClick={() => onClickWidget(this.props)}
      >
        <WidgetHeader
          widget={widget}
          title={title}
          large={large}
          datasets={datasets}
          authenticated={authenticated}
          meta={meta}
          active={active}
          disableDownload={downloadDisabled}
          filterSelected={filterSelected}
          maxSize={maxSize}
          embed={embed}
          settingsConfig={settingsConfig}
          metaKey={metaKey}
          proxy={proxy}
          proxyOn={proxyOn}
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
          shouldSettingsOpen={this.state.shouldSettingsOpen}
          toggleSettingsMenu={toggleSettingsMenu}
        />

        <WidgetBody
          widget={widget}
          chartType={chartType}
          loading={loading}
          metaLoading={metaLoading}
          error={error}
          simple={simple}
          location={location}
          locationName={locationLabelFull}
          active={active}
          data={data}
          legendData={legendData}
          rawData={rawData}
          originalData={originalData}
          settings={settings}
          settingsConfig={settingsConfig}
          preventRenderKeys={preventRenderKeys}
          sentence={sentence}
          config={config}
          handleRefetchData={handleRefetchData}
          handleDataHighlight={handleDataHighlight}
          handleSetInteraction={handleSetInteraction}
          handleChangeSettings={handleChangeSettings}
          parseInteraction={parseInteraction}
          toggleSettingsMenu={toggleSettingsMenu}
          settingsBtnConfig={settingsBtnConfig}
          customComponent={customComponent}
        />
        {sentence && data && (
          <WidgetFooter
            showAttributionLink={showAttributionLink}
            statements={statements}
            type={type}
            locationType={location?.locationType}
            caution={caution}
            simple={simple}
          />
        )}
      </div>
    );
  }
}

export default Widget;
