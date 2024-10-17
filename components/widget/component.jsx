import React, { PureComponent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import WidgetHeader from './components/widget-header';
import WidgetBody from './components/widget-body';
import WidgetFooter from './components/widget-footer';

class Widget extends PureComponent {
  static propTypes = {
    forwardRef: PropTypes.func,
    widget: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    active: PropTypes.bool,
    analysis: PropTypes.bool,
    downloadDisabled: PropTypes.bool,
    filterSelected: PropTypes.bool,
    maxSize: PropTypes.number,
    embed: PropTypes.bool,
    large: PropTypes.bool,
    autoHeight: PropTypes.bool,
    colors: PropTypes.object,
    simple: PropTypes.bool,
    alerts: PropTypes.array,
    datasets: PropTypes.array,
    settings: PropTypes.object,
    settingsConfig: PropTypes.array,
    chartType: PropTypes.string,
    metaKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    loading: PropTypes.bool,
    metaLoading: PropTypes.bool,
    error: PropTypes.bool,
    locationLabel: PropTypes.string,
    locationLabelFull: PropTypes.string,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    legendData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    originalData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rawData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    config: PropTypes.object,
    chartSettings: PropTypes.object,
    sentence: PropTypes.object,
    proxy: PropTypes.bool,
    proxyOn: PropTypes.array,
    handleShowMap: PropTypes.func,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleSetInteraction: PropTypes.func,
    handleDataHighlight: PropTypes.func,
    handleShowShare: PropTypes.func,
    handleIsPlaceholderImage: PropTypes.func,
    placeholderImageURL: PropTypes.string,
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
    chartDecorationConfig: PropTypes.object,
  };

  state = {
    shouldSettingsOpen: false,
  };

  innerRef = React.createRef();

  render() {
    const {
      title,
      widget,
      alerts,
      colors,
      type,
      active,
      analysis,
      downloadDisabled,
      filterSelected,
      maxSize,
      large,
      autoHeight,
      embed,
      simple,
      datasets,
      settings,
      settingsConfig,
      chartType,
      loading,
      metaLoading,
      error,
      locationLabel,
      locationLabelFull,
      data,
      chartSettings,
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
      handleIsPlaceholderImage,
      placeholderImageURL,
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
      chartDecorationConfig,
    } = this.props;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    const { main } = colors || {};
    const toggleSettingsMenu = () =>
      this.setState({ shouldSettingsOpen: !this.state.shouldSettingsOpen });
    const showPlaceholder = handleIsPlaceholderImage(category);

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={this.props.forwardRef}
        id={widget}
        className={cx('c-widget', { large }, { embed }, { simple })}
        data-component-type="dashboard-widget"
        data-layer-id={widget}
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
        {showPlaceholder && (
          <img data-cy="indonesia-img" src={placeholderImageURL} alt="widget" />
        )}
        {!showPlaceholder && (
          <>
            <WidgetHeader
              widget={widget}
              loading={loading}
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
              large={large}
              autoHeight={autoHeight}
              embed={embed}
              analysis={analysis}
              location={location}
              locationName={locationLabelFull}
              active={active}
              data={data}
              legendData={legendData}
              rawData={rawData}
              originalData={originalData}
              settings={settings}
              chartSettings={chartSettings}
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
                alerts={alerts}
                decorationMessage={
                  chartDecorationConfig?.locations.includes(locationLabel)
                    ? chartDecorationConfig?.message
                    : null
                }
                simple={simple}
                alertSystem={rawData?.alerts?.alertSystem}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

export default forwardRef((props, ref) => (
  <Widget forwardRef={ref} {...props} />
));
