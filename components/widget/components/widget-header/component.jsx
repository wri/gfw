import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import cx from 'classnames';
import { format } from 'd3-format';
import WidgetMapButton from './components/widget-map-button';
import WidgetSettingsButton from './components/widget-settings-button';
import WidgetInfoButton from './components/widget-info-button';
import WidgetShareButton from './components/widget-share-button';
import WidgetDownloadButton from './components/widget-download-button';

import './styles.scss';

class WidgetHeader extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    widget: PropTypes.string,
    large: PropTypes.bool,
    maxSize: PropTypes.number,
    proxy: PropTypes.bool,
    proxyOn: PropTypes.array,
    datasets: PropTypes.array,
    loading: PropTypes.bool,
    embed: PropTypes.bool,
    simple: PropTypes.bool,
    active: PropTypes.bool,
    disableDownload: PropTypes.bool,
    filterSelected: PropTypes.bool,
    metaKey: PropTypes.string,
    settingsConfig: PropTypes.array,
    settings: PropTypes.object,
    handleShowInfo: PropTypes.func,
    handleChangeSettings: PropTypes.func,
    handleShowMap: PropTypes.func,
    handleShowShare: PropTypes.func,
    preventCloseSettings: PropTypes.bool,
    getDataURL: PropTypes.func,
    status: PropTypes.string,
    shouldSettingsOpen: PropTypes.bool,
    toggleSettingsMenu: PropTypes.func,
    authenticated: PropTypes.bool,
  };

  render() {
    const {
      widget,
      title,
      loading,
      active,
      disableDownload,
      filterSelected,
      maxSize,
      embed,
      proxy,
      proxyOn,
      large,
      datasets,
      simple,
      settingsConfig,
      metaKey,
      handleShowMap,
      handleShowInfo,
      handleChangeSettings,
      handleShowShare,
      preventCloseSettings,
      getDataURL,
      status,
      authenticated,
      settings,
      shouldSettingsOpen,
      toggleSettingsMenu,
    } = this.props;

    const showSettingsBtn = !simple && !isEmpty(settingsConfig);
    const showDownloadBtn = !embed && getDataURL; // Show everywhere
    const disableDownloadBtn =
      disableDownload || (status !== 'saved' && !settings?.canDownloadUnsaved); // Disable everywhere
    const showMapBtn = !embed && !simple && datasets;
    const showSeparator = showSettingsBtn || showMapBtn;
    const metaInfo =
      typeof metaKey === 'function' ? metaKey(settings) : metaKey;

    let disabledMessageString =
      status === 'unsaved'
        ? 'Save area in My GFW to access downloads.'
        : 'Download unavailable.';

    if (showDownloadBtn && status === 'pending' && authenticated) {
      disabledMessageString =
        'Download will be available soon, please check back in 12-24 hours.';
    } else if (disableDownload && authenticated) {
      disabledMessageString = filterSelected
        ? `Remove Forest Type and Land Category filters to download.`
        : `To download, reduce the total number of alerts to less than ${format(
            ','
          )(maxSize)} by narrowing the date range.`;
    }

    return (
      <div className={cx('c-widget-header', { simple })}>
        <div className="title">{title}</div>
        <div className="options">
          {showMapBtn && (
            <WidgetMapButton
              active={active}
              large={large}
              handleShowMap={handleShowMap}
            />
          )}
          {showSettingsBtn && (
            <WidgetSettingsButton
              settingsConfig={settingsConfig}
              loading={loading}
              title={title}
              embed={embed}
              proxy={proxy}
              proxyOn={proxyOn}
              handleChangeSettings={handleChangeSettings}
              handleShowInfo={handleShowInfo}
              preventCloseSettings={preventCloseSettings}
              active={active}
              shouldSettingsOpen={shouldSettingsOpen}
              toggleSettingsMenu={toggleSettingsMenu}
            />
          )}
          {showSeparator && <span className="separator" />}
          <div className="small-options">
            {showDownloadBtn && (
              <WidgetDownloadButton
                disabled={
                  disableDownloadBtn ||
                  widget === 'gladAlerts' ||
                  widget === 'gladRanked' ||
                  widget === 'integratedAlertsRanked'
                }
                disabledMessage={disabledMessageString}
                {...this.props}
              />
            )}
            <WidgetInfoButton
              square={simple}
              handleOpenInfo={() => handleShowInfo(metaInfo)}
            />
            {!simple && <WidgetShareButton handleShowShare={handleShowShare} />}
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetHeader;
